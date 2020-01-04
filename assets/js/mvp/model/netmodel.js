const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const appconfig = require('../../utility/appconfig')
const request = require('request')

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
}

module.exports = NetModel