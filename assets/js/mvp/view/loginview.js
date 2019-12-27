const BaseView = require('./baseview.js')
const LoginPresenter = require('../presenter/loginpresenter.js')

class LoginView extends BaseView {
    constructor (viewsList) {
        super('login', LoginPresenter, viewsList)
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
        this.getLoginSettings()
        this.addTabbables()
    }

    destroy() {
        super.destroy()

        this.removeEventListeners()
    }

    getElementReferences() {
        this._backgroundVideo = document.getElementById('login-bg-video')
        this._usernameField = document.getElementById('login-username')
        this._usernameSpeechBubble = document.getElementById('login-username-speech-bubble')
        this._passwordField = document.getElementById('login-password')
        this._passwordSpeechBubble = document.getElementById('login-password-speech-bubble')
        this._rememberMeCheckbox = document.getElementById('login-remember-me')
        this._loginButton = document.getElementById('login-button')
        this._createAccountAnchor = document.getElementById('login-create-account')
        this._loginTroubleAnchor = document.getElementById('login-trouble')
        this._loginInteractablesWrapper = document.getElementById('login-interactable-wrapper')
        this._loginLoaderWrapper = document.getElementById('login-loader-wrapper')
        this._showhidePasswordCheckbox = document.getElementById('login-showhide-password-toggle')
    }

    addEventListeners() {
        this._usernameField.addEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._usernameField.addEventListener('blur', this.onUsernameFieldUnfocused.bind(this), false)
        this._usernameField.addEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._passwordField.addEventListener('input', this.onPasswordFieldChanged.bind(this), false)
        this._passwordField.addEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._loginButton.addEventListener('click', this.onSubmit.bind(this), false)

        this._createAccountAnchor.addEventListener('click', this.onCreateAccountClicked.bind(this), false)

        this._showhidePasswordCheckbox.addEventListener('click', this.onShowHidePasswordClicked.bind(this), false)
        this._showhidePasswordCheckbox.addEventListener('mousedown', this.onShowHideMouseDown.bind(this), true)

        this._rememberMeCheckbox.addEventListener('click', this.onRememberMeClicked.bind(this), true)
    }

    removeEventListeners() {
        this._usernameField.removeEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._usernameField.removeEventListener('blur', this.onUsernameFieldUnfocused.bind(this), false)
        this._usernameField.removeEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._passwordField.removeEventListener('input', this.onPasswordFieldChanged.bind(this), false)
        this._passwordField.removeEventListener('keydown', this.onInputFieldKeyDown.bind(this), false)

        this._loginButton.removeEventListener('click', this.onSubmit.bind(this), false)

        this._createAccountAnchor.removeEventListener('click', this.onCreateAccountClicked.bind(this), false)

        this._showhidePasswordCheckbox.removeEventListener('click', this.onShowHidePasswordClicked.bind(this), false)
        this._showhidePasswordCheckbox.removeEventListener('mousedown', this.onShowHideMouseDown.bind(this), true)

        this._rememberMeCheckbox.removeEventListener('click', this.onRememberMeClicked.bind(this), true)
    }

    getLoginSettings() {
        this._presenter.requestLoginSettings()
    }

    addTabbables() {
        let tabbables = [
            this._usernameField,
            this._passwordField,
            this._showhidePasswordCheckbox,
            this._rememberMeCheckbox,
            this._loginButton,
            this._createAccountAnchor,
            this._loginTroubleAnchor
        ]

        super.addTabbables(tabbables)
    }

    startBackgroundVideo() {
        // TODO - reenable
        // this._backgroundVideo.play()
    }

    updateInputWarnings(usernameWarning, passwordWarning) {
        if (usernameWarning !== '') {
            this._usernameField.classList.add('warning-outline')
            this._usernameSpeechBubble.classList.remove('hidden')
            this._usernameSpeechBubble.innerHTML = usernameWarning
        } else {
            this._usernameField.classList.remove('warning-outline')
            this._usernameSpeechBubble.classList.add('hidden')
        }

        if (passwordWarning !== '') {
            this._passwordField.classList.add('warning-outline')
            this._passwordSpeechBubble.classList.remove('hidden')
            this._passwordSpeechBubble.innerHTML = passwordWarning
        } else {
            this._passwordField.classList.remove('warning-outline')
            this._passwordSpeechBubble.classList.add('hidden')
        }

        let noErrors = usernameWarning.length + passwordWarning.length == 0
        let fieldsPopulated =  this._usernameField.value.length > 1 && + this._passwordField.value.length > 1
        
        this._loginButton.disabled = !(fieldsPopulated && noErrors);
    }

    applySettings(settings) {
        this._rememberMeCheckbox.checked = settings.rememberme
        this._usernameField.value = settings.username

        if (settings.username !== '') {
            this.onUsernameFieldChanged()
        }
    }

    selectInputField() {
        if (this._usernameField.value !== '') {
            this._passwordField.focus()
        } else {
            this._usernameField.focus()
        }
    }

    setActive(active) {
        super.setActive(active)
    }

    lockForm() {
        this._usernameField.disabled = true
        this._passwordField.disabled = true
        this._rememberMeCheckbox.disabled = true
        this._loginButton.disabled = true
        this._showhidePasswordCheckbox.disabled = true
        this._createAccountAnchor.style.pointerEvents = 'none'
        this._loginTroubleAnchor.style.pointerEvents = 'none'

        this._loginInteractablesWrapper.classList.add('hidden')
        this._loginLoaderWrapper.classList.remove('hidden')
    }

    unlockForm() {
        this._usernameField.disabled = false
        this._passwordField.disabled = false
        this._rememberMeCheckbox.disabled = false
        this._loginButton.disabled = false
        this._showhidePasswordCheckbox.disabled = false
        this._createAccountAnchor.style.pointerEvents = 'auto'
        this._loginTroubleAnchor.style.pointerEvents = 'auto'

        this._loginInteractablesWrapper.classList.remove('hidden')
        this._loginLoaderWrapper.classList.add('hidden')
    }

    onUsernameFieldChanged() {
        let username = this._usernameField.value

        if (this._usernameField.value === '') {
            this._rememberMeCheckbox.checked = false
        }

        this._presenter.usernameFieldChanged(username)
    }

    onPasswordFieldChanged() {
        let password = this._passwordField.value

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
        this._presenter.submit(this._usernameField.value, this._passwordField.value)

        this.lockForm()
    }

    onCreateAccountClicked(event) {
        event.preventDefault();
        this._presenter.createAccountClicked()
    }

    onShowHidePasswordClicked(event) {
        event.stopPropagation();

        if (this._showhidePasswordCheckbox.checked) {
            this._passwordField.type = 'text'
        } else {
            this._passwordField.type = 'password'
        }

        this._passwordField.focus();

        new Promise(r => setTimeout(r, 0))
        .then(() => {
            this._passwordField.setSelectionRange(this._passwordField.value.length, this._passwordField.value.length)
        })
    }

    onShowHideMouseDown(event) {
        event.preventDefault();
    }

    onRememberMeClicked() {
        let checked = this._rememberMeCheckbox.checked
        this._presenter.setRememberMe(checked)
    }
}

module.exports = LoginView