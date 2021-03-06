const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const appconfig = require('../../utility/appconfig')
const websocket = require('../../utility/websocket')
const request = require('request')

const AUTH_TOKEN_REFRESH_MINUTES = 45
const AUTH_TOKEN_REFRESH_INTERVAL = AUTH_TOKEN_REFRESH_MINUTES * 1000 * 60
const BACKEND_SERVER = "wss://b2gs.jstanton.io:443"
const MATCHMAKING_ENDPOINT = "matchmaking"

let b2ResultCode = new Map()

function makeCreateAccountBody(handle, email, password) {
    return {
        handle: handle,
        email: email,
        password: password
    }
}

function makeAvatarUpdateBody(avatar, authToken) {
    return {
        avatar: avatar,
        authtoken: authToken,
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

        this.onAuthResponse = new B2Event('Auth Response')
        this.onCreateAccountResponse = new B2Event('Create Account Response')
        this.onMatchHistoryResponse = new B2Event('Match History Response')
        this.onGetProfileResponse = new B2Event('Profile Fetch Response')
        this.onGetRankingsResponse = new B2Event('Rankings Fetch Response')

        this.onMatchMakingConnectStarted = new B2Event('MatchMaking Connect Started')
        this.onMatchMakingConnectComplete = new B2Event('MatchMaking Connect Complete')
        this.onMatchMakingGameFound = new B2Event('MatchMaking Game Found')
        this.onMatchMakingGameConfirmed = new B2Event('MatchMaking Game Confirmed')
        this.onMatchMakingOpponentAccepted = new B2Event('MatchMaking Opponent Accepted')
        this.onMatchMakingOpponentFailedToAccept = new B2Event('MatchMaking Opponent Failed To Accept')
        this.onMatchMakingFailedToAccept = new B2Event('MatchMaking Failed To Accept')
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
            if (error) {
                this.broadcast(9999, 'serverConnectionError', this.onAuthResponse)
                return
            } 

            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onAuthResponse)
                this._currentAuthData = body.payload
                this._currentAuthData.handle = handle
                this.keepAuthAlive()
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
            if (error) {
                this.broadcast(9999, 'serverConnectionError', this.onCreateAccountResponse)
                return
            } 

            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onCreateAccountResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, 'genericError', this.onCreateAccountResponse)
                return
            }
            
            this.broadcast(body.code, this.codeToErrorMessage(body.code), this.onCreateAccountResponse)
        })
    }

    sendMatchHistoryRequest() {
        request.get(`${appconfig.apiURL}/${appconfig.matchesPath}/${this.getPublicID()}`, { 
            headers: {'User-Agent': `request.${appconfig.name}.v${appconfig.version}`},
            json: true,
        }, (error, response, body) => {
            if (error) {
                this.broadcast(9999, 'serverConnectionError', this.onMatchHistoryResponse)
                return
            } 

            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onMatchHistoryResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, 'genericError', this.onMatchHistoryResponse)
                return
            }
            
            this.broadcast(body.code, this.codeToErrorMessage(body.code), this.onMatchHistoryResponse)
        })
    }

    sendProfileRequest() {
        request.get(`${appconfig.apiURL}/${appconfig.profilesPath}/${this.getPublicID()}`, { 
            headers: {'User-Agent': `request.${appconfig.name}.v${appconfig.version}`},
            json: true,
        }, (error, response, body) => {
            if (error) {
                this.broadcast(9999, 'serverConnectionError', this.onGetProfileResponse)
                return
            } 

            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onGetProfileResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, 'genericError', this.onGetProfileResponse)
                return
            }
            
            this.broadcast(body.code, this.codeToErrorMessage(body.code), this.onGetProfileResponse)
        })
    }

    sendRankingsRequest() {
        request.get(`${appconfig.apiURL}/${appconfig.leaderboardsPath}`, { 
            headers: {'User-Agent': `request.${appconfig.name}.v${appconfig.version}`},
            qs: { from: 0, count: 100, pid: (this.getPublicID() ? this.getPublicID() : '')},
            json: true,
        }, (error, response, body) => {
            console.log(error)
            console.log(response)
            console.log(body)

            if (error) {
                this.broadcast(9999, 'serverConnectionError', this.onGetRankingsResponse)
                return
            } 

            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onGetRankingsResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, 'genericError', this.onGetRankingsResponse)
                return
            }
            
            this.broadcast(body.code, this.codeToErrorMessage(body.code), this.onGetRankingsResponse)
        })
    }

    sendAvatarUpdateRequest(newAvatar) {

        // This request fails silenty!!
        request.patch(`${appconfig.apiURL}/${appconfig.profilesPath}/${this.getPublicID()}/avatar`, {
            headers: {'User-Agent': `request.${appconfig.name}.v${appconfig.version}`},
            json: true,
            body: makeAvatarUpdateBody(newAvatar, this._currentAuthData.authToken),
        }, (error, response, body) => {
            if (error || response.statusCode != 204) {
                console.log('Avatar update failed')
            } else  {
                console.log('Avatar successfully updated')
            }
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
        this.onMatchMakingConnectStarted.broadcast()

        // Connect to the matchmaking queue
        this._wsconn = new websocket.B2WS(
            `${BACKEND_SERVER}/${MATCHMAKING_ENDPOINT}`,
            this._currentAuthData.pid,
            this._currentAuthData.authToken,
            this.onWebsocketEvent.bind(this)
        )
    }

    acceptReadyCheck() {
        this._wsconn.sendAccept()
    }

    getLaunchConfigData() {
        return [this._currentAuthData.pid, this._currentAuthData.authToken]
    }

    getPublicID() {
        return this._currentAuthData.pid
    }

    getHandle() {
        return this._currentAuthData.handle
    }

    onWebsocketEvent(payload) {
        console.log(payload)

        if (payload.code >= 201 && payload.code <= 206) {
            // Handle error
            return
        }

        switch (payload.code) {
            case 300:
                this.onMatchMakingGameFound.broadcast("")
                break;
            case 302:
                this.onMatchMakingGameConfirmed.broadcast(payload.message)
                break;
            case 303:
                this.onMatchMakingFailedToAccept.broadcast("")
                break;
            case 304:
                this.onMatchMakingConnectComplete.broadcast("")
                break;
            case 305:
                this.onMatchMakingOpponentAccepted.broadcast("")
                break;
            case 306:
                this.onMatchMakingOpponentFailedToAccept.broadcast("")
                break;
            default:
                break;
        }
    }
}

module.exports = NetModel