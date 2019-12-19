const BaseModel = require('./basemodel.js')
const Localization = require('../utility').Localization
const B2Event = require('../utility').B2Event

const usernameValidChars = /^[^ ][A-z0-9 ]+$/;

class LoginModel extends BaseModel {
    constructor () {
        super('login')
        this.init()
    }

    init() {
        super.init()

        this.onInputFieldWarningChanged = new B2Event('Input Field State Changed')

        this._usernameWarning = ""
        this._passwordWarning = ""
    }

    destroy() {
        super.destroy()
    }

    determineUsernameWarning(username) {
        this._usernameWarning = ""
        
        if (username.length < 2) {
            this._usernameWarning = Localization.get('usernameTooShort')
        } else if (!usernameValidChars.test(username)) {
            this._usernameWarning = Localization.get('usernameIllegalChars')
        }  
    }

    determinePasswordWarning(password) {
        this._passwordWarning = ""

        if (password.length < 8) {
            this._passwordWarning = Localization.get('passwordTooShort')
        } 
    }

    broadcastInputFieldWarnings() {
        this.onInputFieldWarningChanged.broadcast({ 
            usernameWarning: this._usernameWarning,
            passwordWarning: this._passwordWarning
        })
    }

    usernameFieldChanged(username) {
        this.determineUsernameWarning(username)

        this.broadcastInputFieldWarnings()
    }

    passwordFieldChanged(password) {
        this.determinePasswordWarning(password)

        this.broadcastInputFieldWarnings()
    }
}

module.exports = LoginModel