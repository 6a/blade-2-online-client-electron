const BasePresenter = require('./basepresenter.js')

class LoginPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.models.get('loading').onLoadingComplete.register(this.onLoadingComplete.bind(this)))
        this.addEventListener(this.model.onInputFieldWarningChanged.register(this.onInputFieldWarningChanged.bind(this)))
        this.addEventListener(this.model.onLoginSettingsRequest.register(this.onLoginSettingsRequest.bind(this)))
        this.addEventListener(this.model.onLoginFinished.register(this.onLoginFinished.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    usernameFieldChanged(username) {
        this.model.usernameFieldChanged(username)
    }

    passwordFieldChanged(password) {
        this.model.passwordFieldChanged(password)
    }

    submit(username, password) {
        this.model.submit(username, password)
    }

    createAccountClicked() {
        this.model.createAccountClicked()
    }

    setRememberMe(remember) {
        this.model.setRememberMe(remember)
    }

    requestLoginSettings() {
        this.model.requestLoginSettings()
    }

    onLoadingComplete() {
        this._view.selectInputField()
        this._view.startBackgroundVideo()
    }

    onInputFieldWarningChanged(data) {
        this._view.updateInputWarnings(data.usernameWarning, data.passwordWarning)
    }

    onLoginSettingsRequest(settings) {
        this._view.applySettings(settings)
    }

    onLoginFinished(error) {
        this._view.loginFinished(error)
    }
}

module.exports = LoginPresenter