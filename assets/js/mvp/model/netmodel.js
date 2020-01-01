const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const Localization = require('../utility').Localization
const appconfig = require('../../appconfig.js')
const request = require('request')

let b2ResultCode = new Map([
    [0, ""],

    // Generic error]
    [100, Localization.get('genericError')],
    [101, Localization.get('genericError')],
    [102, Localization.get('genericError')],
    [103, Localization.get('genericError')],
    [104, Localization.get('genericError')],

    // create account handle error]
    [200, Localization.get('genericError')],
    [201, Localization.get('usernameTooShort')],
    [202, Localization.get('usernameCantStartWithSpace')],
    [203, Localization.get('usernameIllegalChars')],
    [204, Localization.get('usernameAlreadyInUse')],
    [205, Localization.get('usernameRude')],

    // create account email error]
    [300, Localization.get('genericError')],
    [301, Localization.get('emailInvalid')],
    [302, Localization.get('emailAlreadyInUse')],

    // auth
    [500, Localization.get('genericError')],
    [501, Localization.get('genericError')],
    [502, Localization.get('genericError')],
    [503, Localization.get('invalidCredentials')],
])

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
    }

    init() {
        super.init()

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
                "Authorization": `Basic ${btoa(`${handle}:${password}`)}`
            },
            json: true
        }, (error, response, body) => {
            if (response.statusCode == 200) {
                this.broadcast(0, body.payload, this.onAuthResponse)
                return
            } 

            if (error) {
                this.broadcast(9999, Localization.get('serverConnectionError'), this.onAuthResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, Localization.get('genericError'), this.onAuthResponse)
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
                this.broadcast(9999, Localization.get('serverConnectionError'), this.onCreateAccountResponse)
                return
            } 

            if (body.code === undefined || body.payload === undefined) {
                this.broadcast(9999, Localization.get('genericError'), this.onCreateAccountResponse)
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