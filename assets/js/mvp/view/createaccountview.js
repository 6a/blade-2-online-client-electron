const BaseView = require('./baseview.js')
const CreateAccountPresenter = require('../presenter/createaccountpresenter.js')
const PasswordWarningState = require('../utility').containers.PasswordWarningState

class CreateAccountView extends BaseView {
    constructor (viewsList) {
        super('createaccount', CreateAccountPresenter, viewsList, 'hidden')
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
        this.addTabbables()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('create-account')

        this._interactablesWrapper = document.getElementById('create-account-interactables-wrapper')
        this._loaderWrapper = document.getElementById('create-account-loader-wrapper')

        this._usernameField = document.getElementById('create-account-username')
        this._usernameWarning = document.getElementById('create-account-username-warning')

        this._emailField = document.getElementById('create-account-email')
        this._emailWarning = document.getElementById('create-account-email-warning')

        this._passwordField = document.getElementById('create-account-password')
        this._passwordReqsWrapper = document.getElementById('create-account-password-reqs')
        this._passwordReqsWarningHeader = document.getElementById('create-account-password-warning-header')
        this._passwordReqASCII = document.getElementById('create-account-password-req-ascii')
        this._passwordReq15Chars = document.getElementById('create-account-password-req-15-chars')
        this._passwordReq8Chars = document.getElementById('create-account-password-req-8-chars')
        this._passwordReq1Numeral = document.getElementById('create-account-password-req-1-numeral')
        this._passwordReq1LowerCase = document.getElementById('create-account-password-req-1-lowercase')

        this._showhidePasswordCheckbox = document.getElementById('create-account-showhide-password-toggle')

        this._successWrapper = document.getElementById('create-account-success-wrapper')
        this._successUsername = document.getElementById('create-account-success-username')
        this._successButton = document.getElementById('create-account-success-button')

        this._serverErrorWrapper = document.getElementById('create-account-server-error-wrapper')
        this._serverErrorText = document.getElementById('create-account-server-error-text')
        this._serverErrorButton = document.getElementById('create-account-server-error-button')

        this._submitButton = document.getElementById('create-account-button')
        this._detailsWrapper = document.getElementById('create-account-details-wrapper')
        this._closeAnchor = document.getElementById('create-account-close')
    }

    addEventListeners() {
        this._usernameField.addEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._emailField.addEventListener('input', this.onEmailFieldChanged.bind(this), false)
        this._passwordField.addEventListener('input', this.onPasswordFieldChanged.bind(this), false)

        this._showhidePasswordCheckbox.addEventListener('click', this.onShowHidePasswordClicked.bind(this), false)
        this._showhidePasswordCheckbox.addEventListener('mousedown', this.onShowHideMouseDown.bind(this), true)

        this._submitButton.addEventListener('click', this.onSubmitClicked.bind(this), false)
        this._closeAnchor.addEventListener('click', this.onCloseClicked.bind(this), false)
        this._successButton.addEventListener('click', this.onSuccessButtonClicked.bind(this), false)
        this._serverErrorButton.addEventListener('click', this.onServerErrorButtonClicked.bind(this), false)
        
        document.addEventListener('keydown', this.onEscDown.bind(this), false)
    }

    removeEventListeners() {
        this._usernameField.removeEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._emailField.removeEventListener('input', this.onEmailFieldChanged.bind(this), false)
        this._passwordField.removeEventListener('input', this.onPasswordFieldChanged.bind(this), false)

        this._showhidePasswordCheckbox.removeEventListener('click', this.onShowHidePasswordClicked.bind(this), false)
        this._showhidePasswordCheckbox.removeEventListener('mousedown', this.onShowHideMouseDown.bind(this), true)

        this._submitButton.removeEventListener('click', this.onSubmitClicked.bind(this), false)
        this._closeAnchor.removeEventListener('click', this.onCloseClicked.bind(this), false)
        this._successButton.removeEventListener('click', this.onSuccessButtonClicked.bind(this), false)
        this._serverErrorButton.removeEventListener('click', this.onServerErrorButtonClicked.bind(this), false)

        document.removeEventListener('keydown', this.onEscDown.bind(this), false)
    }

    addTabbables() {
        let tabbables = [
            this._usernameField,
            this._emailField,
            this._passwordField,
            this._showhidePasswordCheckbox,
            this._submitButton,
            this._closeAnchor,
        ]

        super.addTabbables(tabbables)
    }

    resetForm() {
        let allInputLabels = document.querySelectorAll('#create-account-email-password-wrapper .text-input-label')
        allInputLabels.forEach((element) => { element.classList.add('no-transition') })

        this._usernameField.value = ''
        this._usernameField.classList.remove('border-bottom-negative')
        this._usernameField.classList.remove('border-bottom-positive')
        this._usernameWarning.classList.add('hidden')

        this._emailField.value = ''
        this._emailField.classList.remove('warning-outline')
        this._emailWarning.classList.add('hidden')

        this._passwordField.value = ''
        this._passwordField.classList.remove('warning-outline')
        this._passwordReqsWrapper.classList.add('hidden')

        this.setPasswordInfoStyle(this._passwordReqASCII, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq15Chars, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq8Chars, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq1Numeral, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq1LowerCase, 'ca-li-inactive')

        this.toggleHidden(this._interactablesWrapper, false)
        this.toggleHidden(this._loaderWrapper, true)
        this.toggleHidden(this._successWrapper, true)
        this.toggleHidden(this._closeAnchor, false)

        this._submitButton.disabled = true

        // Dirty hack
        new Promise(r => setTimeout(r, 100))
        .then(() => { allInputLabels.forEach((element) => { element.classList.remove('no-transition') }) })
    }

    lockForm() {
        this._usernameField.disabled = true
        this._emailField.disabled = true
        this._passwordField.disabled = true

        this._submitButton.classList.add('no-pointer-events')
        this._showhidePasswordCheckbox.disabled = true

        this.toggleHidden(this._closeAnchor, true)
    }

    unlockForm() {
        this._usernameField.disabled = false
        this._emailField.disabled = false
        this._passwordField.disabled = false

        this._submitButton.classList.remove('no-pointer-events')
        this._showhidePasswordCheckbox.disabled = false

        this.toggleHidden(this._closeAnchor, false)
    }

    onCloseClicked(event) {
        event.preventDefault();
        this._presenter.closeForm()
    }

    onUsernameFieldChanged() {
        let value = this._usernameField.value

        this._presenter.usernameFieldChanged(value)
    }

    onEmailFieldChanged() {
        let value = this._emailField.value

        this._presenter.emailFieldChanged(value)
    }

    onPasswordFieldChanged() {
        let value = this._passwordField.value

        this._presenter.passwordFieldChanged(value)
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

    onSubmitClicked() {
        this._presenter.submit(this._usernameField.value, this._emailField.value, this._passwordField.value)

        this.toggleHidden(this._interactablesWrapper, true)
        this.toggleHidden(this._loaderWrapper, false)

        this.lockForm()
    }

    onSuccessButtonClicked() {
        this._presenter.closeForm()
    }

    onServerErrorButtonClicked() {
        this.toggleHidden(this._interactablesWrapper, false)
        this.toggleHidden(this._serverErrorWrapper, true)

        this.unlockForm()
    }

    setPasswordInfoStyle(element, className) {
        const classes = ['ca-li-inactive', 'ca-li-pass', 'ca-li-fail']
        classes.forEach((c) => {
            element.classList.remove(c)
        })

        element.classList.add(className)
    }

    updateWarnings(lKeys) {
        let usernameWarning = lKeys.usernameWarning
        let emailWarning = lKeys.emailWarning
        let passwordWarning = lKeys.passwordWarning

        if (usernameWarning !== '') {
            this._usernameField.classList.add('border-bottom-negative')
            this._usernameField.classList.remove('border-bottom-positive')
        } else {
            if (this._usernameField.value === '') {
                this._usernameField.classList.remove('border-bottom-negative')
                this._usernameField.classList.remove('border-bottom-positive')
            } else {
                this._usernameField.classList.remove('border-bottom-negative')
                this._usernameField.classList.add('border-bottom-positive')
            }
        }

        if (emailWarning !== '') {
            this._emailField.classList.add('warning-outline')
        } else {
            this._emailField.classList.remove('warning-outline')
        }

        if (passwordWarning.hasWarnings) {
            this._passwordField.classList.add('warning-outline')
        } else {
            this._passwordField.classList.remove('warning-outline')
        }

        this.toggleHidden(this._usernameWarning, usernameWarning === '')     
        if (usernameWarning !== '') {
            this.setLocalizedInnerHTML(this._usernameWarning, usernameWarning)
        }

        this.toggleHidden(this._emailWarning, emailWarning === '')
        if (emailWarning !== '') {
            this.setLocalizedInnerHTML(this._emailWarning, emailWarning)
        }

        this.updatePasswordwarning(passwordWarning)

        let noWarnings = (usernameWarning === '' && emailWarning === '' && !passwordWarning.hasWarnings)
        let fieldsPopulated = this._usernameField.value.length > 0 && this._emailField.value.length > 0 && this._passwordField.value.length > 0

        this._submitButton.disabled = !(noWarnings && fieldsPopulated)
    }

    /**
     * Helper function for updating the state of the password warning text display
     * @param {PasswordWarningState} passwordWarnings 
     */
    updatePasswordwarning(passwordWarnings) {
        if (passwordWarnings.hasWarnings) {
            this.toggleHidden(this._passwordReqsWrapper, false)
            this._passwordReqsWarningHeader.classList.remove('text-positive')
        } else {
            this._passwordReqsWarningHeader.classList.add('text-positive')
        }

        this.setPasswordInfoStyle(this._passwordReqASCII, `ca-li-${passwordWarnings.ascii}`)
        this.setPasswordInfoStyle(this._passwordReq15Chars, `ca-li-${passwordWarnings.fifteenChars}`)
        this.setPasswordInfoStyle(this._passwordReq8Chars, `ca-li-${passwordWarnings.eightChars}`)
        this.setPasswordInfoStyle(this._passwordReq1Numeral, `ca-li-${passwordWarnings.oneNumeral}`)
        this.setPasswordInfoStyle(this._passwordReq1LowerCase, `ca-li-${passwordWarnings.oneLowerCase}`)
    }

    setActive(active) {
        super.setActive(active)

        if (active) {
            this.resetForm()
            this.unlockForm()
        }
    }

    showSuccessDialogue(username) {
        this.toggleHidden(this._loaderWrapper, true)
        this.toggleHidden(this._successWrapper, false)

        this._successUsername.innerHTML = username
    }

    showServerErrorDialogue(lKey) {
        this.toggleHidden(this._loaderWrapper, true)
        this.toggleHidden(this._serverErrorWrapper, false)

        this.setLocalizedInnerHTML(this._serverErrorText, lKey)
    }

    displayCreationErrors(target, lKey) {
        this.toggleHidden(this._loaderWrapper, true)
        this.toggleHidden(this._interactablesWrapper, false)
        this.unlockForm()

        if (target === 'username') {
            this.toggleHidden(this._usernameWarning, false)
            this.setLocalizedInnerHTML(this._usernameWarning, lKey)
            this._usernameField.classList.add('border-bottom-negative')
            this._usernameField.classList.remove('border-bottom-positive')
        } else if (target === 'email') {
            this.toggleHidden(this._emailWarning, false)
            this.setLocalizedInnerHTML(this._emailWarning, lKey)
            this._emailField.classList.add('warning-outline')
        }
    }
}

module.exports = CreateAccountView