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

        this.onReady = new B2Event('Loading Complete Relay')
        this.onLoginSettingsRequest = new B2Event('Login Settings Broadcast')
        this.onInputFieldWarningChanged = new B2Event('Input Field State Changed')
        this.onCreateAccountModalRequested = new B2Event('Create Account Modal Requested')
        this.onLoginFinished = new B2Event('Login Finished')
        this.onToggleBackgroundVideo = new B2Event('Toggle Background Video')

        this.addEventListener(this.models.get('loading').onLoadingComplete.register(this.onLoadingComplete.bind(this)))
        this.addEventListener(this.models.get('net').onAuthResponse.register(this.onAuthResponse.bind(this)))
        this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.onCreateAccountResponse.bind(this)))
        this.addEventListener(this.models.get('options').onSettingChanged.register(this.onSettingChanged.bind(this)))

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

    onLoadingComplete() {
        this.onReady.broadcast(!Settings.get(Settings.KEY_DISABLE_BACKGROUND_VIDEOS))
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
        let msg = typeof(response.payload) === 'string' ? response.payload : ''
        this.onLoginFinished.broadcast(msg)
    }

    onSettingChanged(setting) {
        if (setting.setting === 'disableBackgroundVideos') {
            this.onToggleBackgroundVideo.broadcast(setting.newValue)
        }
    }
}

module.exports = LoginModel