const BaseModel = require('./basemodel.js')
const Localization = require('../utility').Localization
const B2Event = require('../utility').B2Event
const Settings = require('../utility/settings.js')

const usernameValidChars = /^[^ ][A-z0-9 ]+$/;

class LoginModel extends BaseModel {
    constructor () {
        super('login')
        this.init()
    }

    init() {
        super.init()

        this.onLoginSettingsRequest = new B2Event('Login Settings Broadcast')
        this.onInputFieldWarningChanged = new B2Event('Input Field State Changed')
        this.onCreateAccountModalRequested = new B2Event('Create Account Modal Requested')

        this._usernameWarning = ""
        this._passwordWarning = ""

        this._rememberMe = false
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

        if (this._rememberMe) {
            Settings.set(Settings.KEY_USERNAME, username)
        }

        this.broadcastInputFieldWarnings()
    }

    passwordFieldChanged(password) {
        this.determinePasswordWarning(password)

        this.broadcastInputFieldWarnings()
    }

    submit(username, password) {
        // TODO implement
        console.log(`Login model - received submit | username: ${username}, password: ${password}`)
    }

    createAccountClicked() {
        this.onCreateAccountModalRequested.broadcast()
    }

    setRememberMe(remember) {
        Settings.set(Settings.KEY_REMEMBER_ME, remember)

        this._rememberMe = remember
    }

    requestLoginSettings() {
        var rememberMeChecked = Settings.get(Settings.KEY_REMEMBER_ME)
        var username = Settings.get(Settings.KEY_USERNAME)

        this.onLoginSettingsRequest.broadcast({
            rememberme: rememberMeChecked,
            username: username,
        })

        this._rememberMe = rememberMeChecked
    }
}

module.exports = LoginModel