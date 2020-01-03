const BaseModel = require('./basemodel.js')
const { Validation, B2Event } = require('../utility')
const Settings = require('../../utility/settings')

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
        this.onLoginFinished = new B2Event('Login Finished')

        this.addEventListener(this.models.get('net').onAuthResponse.register(this.onAuthResponse.bind(this)))
        this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.onCreateAccountResponse.bind(this)))

        this._usernameWarning = ''
        this._passwordWarning = ''

        this._rememberMe = false
        this._storedUsername = ''

        this.show()
    }

    destroy() {
        super.destroy()
    }

    determineUsernameWarning(username) {
        this._usernameWarning = ''
        
        if (username.length < 2) {
            this._usernameWarning = 'usernameTooShort'
        } else if (!Validation.noSpaceAtStart.test(username)) {
            this._usernameWarning = 'usernameCantStartWithSpace'
        }
    }

    determinePasswordWarning(password) {
        this._passwordWarning = ''

        if (password.length == 0) {
            this._passwordWarning = 'passwordEmpty'
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
        this.models.get('net').sendAuthRequest(username, password)
    }

    createAccountClicked() {
        this.setLocked(true)
        this.onCreateAccountModalRequested.broadcast()
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

    onAuthResponse(response) {
        if (response.code === 0) {
            this.onLoginFinished.broadcast()
        } else {
            this.onLoginFinished.broadcast(response.payload)
        }
    }
}

module.exports = LoginModel