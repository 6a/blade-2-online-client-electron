const BasePresenter = require('./basepresenter.js')

class LoginPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this._models.get('loading').onLoadingComplete.register(this.onLoadingComplete.bind(this)))
        this.addEventListener(this._models.get('login').onInputFieldWarningChanged.register(this.onInputFieldWarningChanged.bind(this)))
        this.addEventListener(this._models.get('login').onLoginSettingsRequest.register(this.onLoginSettingsRequest.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    usernameFieldChanged(username) {
        this._models.get('login').usernameFieldChanged(username)
    }

    passwordFieldChanged(password) {
        this._models.get('login').passwordFieldChanged(password)
    }

    submit(username, password) {
        this._models.get('login').submit(username, password)
    }

    createAccountClicked() {
        this._models.get('login').createAccountClicked()
    }

    setRememberMe(remember) {
        this._models.get('login').setRememberMe(remember)
    }

    requestLoginSettings() {
        this._models.get('login').requestLoginSettings()
    }

    onLoadingComplete() {
        this._view.startBackgroundVideo()
    }

    onInputFieldWarningChanged(data) {
        this._view.updateInputWarnings(data.usernameWarning, data.passwordWarning)
    }

    onLoginSettingsRequest(settings) {
        this._view.applySettings(settings)
    }
}

module.exports = LoginPresenter