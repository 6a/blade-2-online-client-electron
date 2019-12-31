const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const Localization = require('../utility').Localization
const appconfig = require('../../appconfig.js')
const request = require('request')

let errorMap = new Map([
    [0, ""],

    // Generic error]
    [100, Localization.get('serverGenericError')],
    [101, Localization.get('serverGenericError')],

    // create account handle error]
    [200, Localization.get('serverGenericError')],
    [201, Localization.get('usernameTooShort')],
    [202, Localization.get('usernameCantStartWithSpace')],
    [203, Localization.get('usernameIllegalChars')],
    [204, Localization.get('usernameAlreadyInUse')],
    [205, Localization.get('usernameRude')],

    // create account email error]
    [300, Localization.get('serverGenericError')],
    [301, Localization.get('emailInvalid')],
    [302, Localization.get('emailAlreadyInUse')]
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
        console.error("sendAuthRequest() not implemented")
    }

    sendCreateAccountRequest(handle, email, password) {
        request.post(`${appconfig.api}/${appconfig.users}`, {
            headers: {'User-Agent': `request.${appconfig.name}.v${appconfig.version}`},
            json: true,
            body: makeCreateAccountBody(handle, email, password),
        }, (error, response, body) => {
            if (error) {
                this.broadcast(9999, Localization.get('serverConnectionError'), this.onCreateAccountResponse)
                return
            } 

            if (response.statusCode == 200) {
                this.broadcast(0, body.message, this.onCreateAccountResponse)
                return
            } 

            if (body.code === undefined || body.message === undefined) {
                this.broadcast(9999, Localization.get('serverConnectionError'), this.onCreateAccountResponse)
                return
            }
            
            this.broadcast(body.code, this.codeToErrorMessage(body.code), this.onCreateAccountResponse)
        })
    }

    broadcast(code, message, event) {
        event.broadcast({
            code: code,
            message: message
        })
    }

    codeToErrorMessage(code) {
        if (errorMap.has(code)) {
            return errorMap.get(code)
        }

        return ""
    }
}

module.exports = NetModel