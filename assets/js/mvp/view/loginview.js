const BaseView = require('./baseview.js')
const LoginPresenter = require('../presenter/loginpresenter')

class LoginView extends BaseView {
    constructor (viewsList) {
        super('login', LoginPresenter, viewsList)
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._backgroundVideo = document.getElementById('login-bg-video')
        this._usernameField = document.getElementById('login-username')
        this._passwordField = document.getElementById('login-password')
        this._rememberMeCheckbox = document.getElementById('login-remember-me')
        this._loginButton = document.getElementById('login-button')
        this._createAccountAnchor = document.getElementById('login-create-account')
        this._loginTroubleAnchor = document.getElementById('login-trouble')
    }

    addEventListeners() {
        this._usernameField.addEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._passwordField.addEventListener('input', this.onPasswordFieldChanged.bind(this), false)
    }

    onUsernameFieldChanged() {
        var username = this._usernameField.value

        this._presenter.usernameFieldChanged(username)
    }

    onPasswordFieldChanged() {
        var password = this._passwordField.value

        this._presenter.passwordFieldChanged(password)
    }

    startBackgroundVideo() {
        // TODO - reenable
        // this._backgroundVideo.play()
    }

    updateInputWarnings(usernameWarning, passwordWarning) {
        if (usernameWarning !== "") {
            this._usernameField.classList.add('warning-outline')
        } else {
            this._usernameField.classList.remove('warning-outline')
        }

        if (passwordWarning !== "") {
            this._passwordField.classList.add('warning-outline')
        } else {
            this._passwordField.classList.remove('warning-outline')
        }
    }
}

module.exports = LoginView