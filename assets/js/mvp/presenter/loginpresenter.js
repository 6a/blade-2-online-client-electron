const BasePresenter = require('./basepresenter.js')

class LoginPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onReady.register(this.onReady.bind(this)))
        this.addEventListener(this.model.onInputFieldWarningChanged.register(this.onInputFieldWarningChanged.bind(this)))
        this.addEventListener(this.model.onLoginSettingsRequest.register(this.onLoginSettingsRequest.bind(this)))
        this.addEventListener(this.model.onLoginFinished.register(this.onLoginFinished.bind(this)))
        this.addEventListener(this.model.onToggleBackgroundVideo.register(this.onToggleBackgroundVideo.bind(this)))
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

    onReady(playVideo) {
        this._view.selectInputField()
        this._view.toggleBackgroundVideo(!playVideo)
    }

    onInputFieldWarningChanged(data) {
        this._view.updateInputWarnings(data.usernameWarning, data.passwordWarning)
    }

    onLoginSettingsRequest(settings) {
        this._view.applySettings(settings)
    }

    onLoginFinished(msg) {
        this._view.loginFinished(msg)
    }

    onToggleBackgroundVideo(disabled) {
        this._view.toggleBackgroundVideo(disabled)
    }
}

module.exports = LoginPresenter