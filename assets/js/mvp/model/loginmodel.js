const BaseModel = require('./basemodel.js')
const Localization = require('../utility').Localization
const Validation = require('../utility').Validation
const B2Event = require('../utility').B2Event
const Settings = require('../utility/settings.js')

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

        this.addEventListener(this._models.get('net').onCreateAccountResponse.register(this.onCreateAccountResponse.bind(this)))

        this._usernameWarning = ''
        this._passwordWarning = ''

        this._rememberMe = false
        this._storedUsername = ''
    }

    destroy() {
        super.destroy()
    }

    determineUsernameWarning(username) {
        this._usernameWarning = ''
        
        if (username.length < 2) {
            this._usernameWarning = Localization.get('usernameTooShort')
        } else if (!Validation.noSpaceAtStart.test(username)) {
            this._usernameWarning = Localization.get('usernameCantStartWithSpace')
        }
    }

    determinePasswordWarning(password) {
        this._passwordWarning = ''

        if (password.length == 0) {
            this._passwordWarning = Localization.get('passwordEmpty')
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

        this._rememberMe = (username !== undefined && username !== '')

        if (this._rememberMe) {
            Settings.set(Settings.KEY_USERNAME, username)
        } else {
            Settings.set(Settings.KEY_USERNAME, '')
        }

        this._storedUsername = username

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
        this.hide()
    }

    setRememberMe(remember) {
        this._rememberMe = remember
        if (remember) {
            Settings.set(Settings.KEY_USERNAME, this._storedUsername)
        } else {
            Settings.set(Settings.KEY_USERNAME, '')
        }
    }

    requestLoginSettings() {
        this._storedUsername = Settings.get(Settings.KEY_USERNAME)
        if (this._storedUsername !== undefined && this._storedUsername !== "") {
            this._rememberMe = true
        } else {
            this._rememberMe = false
            this._storedUsername = ''
        }

        this.onLoginSettingsRequest.broadcast({
            rememberme: this._rememberMe,
            username: this._storedUsername,
        })
    }

    onCreateAccountResponse(response) {
        if (response.code === 0) {
            this._storedUsername = response.payload.handle
            this.setRememberMe(true)
    
            this.onLoginSettingsRequest.broadcast({
                rememberme: true,
                username: response.payload.handle,
            })
        }
    }
}

module.exports = LoginModel