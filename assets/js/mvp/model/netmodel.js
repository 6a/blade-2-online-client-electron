const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const appconfig = require('../../utility/appconfig')
const websocket = require('../../utility/websocket')
const request = require('request')

const AUTH_TOKEN_REFRESH_MINUTES = 45
const AUTH_TOKEN_REFRESH_INTERVAL = AUTH_TOKEN_REFRESH_MINUTES * 1000 * 60
const BACKEND_SERVER = "ws://localhost:80"
const MATCHMAKING_ENDPOINT = "matchmaking"
const GAMESERVER_ENDPOINT = "game"

let b2ResultCode = new Map()

function makeCreateAccountBody(handle, email, password) {
    return {
        handle: handle,
        email: email,
        password: password
    }
}

class NetModel extends BaseModel {
    constructor () {
        super('net')
        this.init()
        this._active = true
        this._currentAuthData = {}
        this._wsconn
    }

    init() {
        super.init()

        b2ResultCode = new Map([
            [0, ""],
        
            // Generic error]
            [100, 'genericError'],
            [101, 'genericError'],
            [102, 'genericError'],
            [103, 'genericError'],
            [104, 'genericError'],
        
            // create account handle error]
            [200, 'genericError'],
            [201, 'usernameTooShort'],
            [202, 'usernameCantStartWithSpace'],
            [203, 'usernameIllegalChars'],
            [204, 'usernameAlreadyInUse'],
            [205, 'usernameRude'],
        
            // create account email error]
            [300, 'genericError'],
            [301, 'emailInvalid'],
            [302, 'emailAlreadyInUse'],
        
            // auth
            [500, 'genericError'],
            [501, 'genericError'],
            [502, 'genericError'],
            [503, 'invalidCredentials'],
        ])

        this.onAuthResponse = new B2Event('Auth Request Response')
        this.onCreateAccountResponse = new B2Event('Create Account Request Response')
        this.onMatchMakingConnectComplete = new B2Event('MatchMaking Connect Complete')
        this.onMatchMakingGameFound = new B2Event('MatchMaking Game Found')
        this.onMatchMakingGameConfirmed = new B2Event('MatchMaking Game Confirmed')
        
    }

    destroy() { 
        super.destroy()
    }

    sendAuthRequest(handle, password) {
        request.post(`${appconfig.apiURL}/${appconfig.authPath}`, {
            headers: {
                'User-Agent': `request.${appconfig.name}.v${appconfig.version}`,
                "Authorization": `Basic ${btoa(unescape(encodeURIComponent(`${handle}:${password}`)))}`
            },
            json: true
        }, (error, response, body) => {
            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onAuthResponse)
                this._currentAuthData = body.payload
                this.keepAuthAlive()
                return
            } 

            if (error) {
                this.broadcast(9999, 'serverConnectionError', this.onAuthResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, 'genericError', this.onAuthResponse)
                return
            }
            
            this.broadcast(body.code, this.codeToErrorMessage(body.code), this.onAuthResponse)
        })
    }

    sendCreateAccountRequest(handle, email, password) {
        request.post(`${appconfig.apiURL}/${appconfig.usersPath}`, {
            headers: {'User-Agent': `request.${appconfig.name}.v${appconfig.version}`},
            json: true,
            body: makeCreateAccountBody(handle, email, password),
        }, (error, response, body) => {
            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onCreateAccountResponse)
                return
            } 

            if (error) {
                this.broadcast(9999, 'serverConnectionError', this.onCreateAccountResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, 'genericError', this.onCreateAccountResponse)
                return
            }
            
            this.broadcast(body.code, this.codeToErrorMessage(body.code), this.onCreateAccountResponse)
        })
    }

    broadcast(code, payload, event) {
        event.broadcast({
            code: code,
            payload: payload
        })
    }

    codeToErrorMessage(code) {
        if (b2ResultCode.has(code)) {
            return b2ResultCode.get(code)
        }

        return ""
    }

    keepAuthAlive() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Keepalive code goes here
            }, AUTH_TOKEN_REFRESH_INTERVAL)
        })
    }

    startMatchMaking() {
        console.log("Matchmaking started")

        // Connect to the matchmaking queue
        this._wsconn = new websocket.B2WS(
            `${BACKEND_SERVER}/${MATCHMAKING_ENDPOINT}`,
            this._currentAuthData.pid,
            this._currentAuthData.authToken,
            this.onWebsocketEvent.bind(this)
        )
    }

    onWebsocketEvent(payload) {
        console.log(payload)

        if (payload.code >= 201 && payload.code <= 206) {
            // Handle error
            return
        }

        switch (payload.code) {
            case 300:
                // Ready check start
                this.onMatchMakingGameFound.broadcast()
                break;
            case 301:
                // Handle ready check success

                break;
            case 302:
                // Handle - this needs to be written to file along with all the other launch data
                this.onMatchMakingGameConfirmed.broadcast(payload.message)
                break;
            case 303:
                // handle ready check failure    

                break;
            case 304:
                this.onMatchMakingConnectComplete.broadcast("")
                break;
            default:
                break;
        }
    }
}

module.exports = NetModel