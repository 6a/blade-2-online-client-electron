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

        this.removeEventListeners()
    }

    getElementReferences() {
        this._backgroundVideo = document.getElementById('login-bg-video')
        this._usernameField = document.getElementById('login-username')
        this._passwordField = document.getElementById('login-password')
        this._rememberMeCheckbox = document.getElementById('login-remember-me')
        this._loginButton = document.getElementById('login-button')
        this._createAccountAnchor = document.getElementById('login-create-account')
        this._loginTroubleAnchor = document.getElementById('login-trouble')
        this._loginInteractablesWrapper = document.getElementById('login-interactable-wrapper')
        this._loginLoaderWrapper = document.getElementById('login-loader-wrapper')
    }

    addEventListeners() {
        this._usernameField.addEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._usernameField.addEventListener('blur', this.onUsernameFieldUnfocused.bind(this), false)
        this._usernameField.addEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._passwordField.addEventListener('input', this.onPasswordFieldChanged.bind(this), false)
        this._passwordField.addEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._loginButton.addEventListener('click', this.onSubmit.bind(this), false)
    }

    removeEventListeners() {
        this._usernameField.removeEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._usernameField.removeEventListener('blur', this.onUsernameFieldUnfocused.bind(this), false)
        this._usernameField.removeEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._passwordField.removeEventListener('input', this.onPasswordFieldChanged.bind(this), false)
        this._passwordField.removeEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._loginButton.removeEventListener('click', this.onSubmit.bind(this), false)
    }

    onUsernameFieldChanged() {
        var username = this._usernameField.value

        this._presenter.usernameFieldChanged(username)
    }

    onPasswordFieldChanged() {
        var password = this._passwordField.value

        this._presenter.passwordFieldChanged(password)
    }

    onUsernameFieldUnfocused() {
        this._usernameField.value = this._usernameField.value.trimEnd()
    }

    onInputFieldKeyDown(e) {
        if (e.keyCode === 13 && !this._loginButton.disabled) {
            this.onSubmit()
        }
    }

    onSubmit() {
        console.log("submitting login form")

        this._usernameField.disabled = true
        this._passwordField.disabled = true
        this._rememberMeCheckbox.disabled = true
        this._loginButton.disabled = true
        this._loginInteractablesWrapper.classList.add('hidden')
        this._loginLoaderWrapper.classList.remove('hidden')
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

        var noErrors = usernameWarning.length + passwordWarning.length == 0
        var fieldsPopulated =  this._usernameField.value.length > 1 && + this._passwordField.value.length > 1
        
        this._loginButton.disabled = !(fieldsPopulated && noErrors);
    }
}

module.exports = LoginView