const BaseView = require('./baseview.js')
const CreateAccountPresenter = require('../presenter/createaccountpresenter.js')
const PasswordWarningState = require('../utility').Containers.PasswordWarningState

class CreateAccountView extends BaseView {
    constructor (viewsList) {
        super('createaccount', CreateAccountPresenter, viewsList)
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
        this.addTabbables()
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('create-account')

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

        this._submitButton = document.getElementById('create-account-button')
        this._detailsWrapper = document.getElementById('create-account-details-wrapper')
        this._closeButton = document.getElementById('create-account-close')
    }

    addEventListeners() {
        this._usernameField.addEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._emailField.addEventListener('input', this.onEmailFieldChanged.bind(this), false)
        this._passwordField.addEventListener('input', this.onPasswordFieldChanged.bind(this), false)

        this._closeButton.addEventListener('click', this.onCloseClicked.bind(this), false)
    }

    removeEventListeners() {
        this._usernameField.removeEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        this._emailField.removeEventListener('input', this.onEmailFieldChanged.bind(this), false)
        this._passwordField.removeEventListener('input', this.onPasswordFieldChanged.bind(this), false)

        this._closeButton.removeEventListener('click', this.onCloseClicked.bind(this), false)
    }

    addTabbables() {
        let tabbables = [
            this._usernameField,
            this._emailField,
            this._passwordField,
            this._showhidePasswordCheckbox,
            this._submitButton,
            this._closeButton,
        ]

        super.addTabbables(tabbables)
    }

    resetForm() {
        this._usernameField.value = ''
        this._usernameWarning.classList.add('hidden')

        this._emailField.value = ''
        this._emailWarning.classList.add('hidden')

        this._passwordField.value = ''
        this._passwordReqsWrapper.classList.add('hidden')

        this.setPasswordInfoStyle(this._passwordReqASCII, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq15Chars, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq8Chars, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq1Numeral, 'ca-li-inactive')
        this.setPasswordInfoStyle(this._passwordReq1LowerCase, 'ca-li-inactive')

        this._submitButton.disabled = true
    }

    onCloseClicked(event) {
        event.preventDefault();
        this._presenter.closeClicked()
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

    setPasswordInfoStyle(element, className) {
        const classes = ['ca-li-inactive', 'ca-li-pass', 'ca-li-fail']
        classes.forEach((c) => {
            element.classList.remove(c)
        })

        element.classList.add(className)
    }

    updateWarnings(warnings) {
        let usernameWarning = warnings.usernameWarning
        let emailWarning = warnings.emailWarning
        let passwordWarning = warnings.passwordWarning

        this.toggleHidden(this._usernameWarning, usernameWarning === '')
        this._usernameWarning.innerHTML = usernameWarning

        this.toggleHidden(this._emailWarning, emailWarning === '')
        this._emailWarning.innerHTML = emailWarning

        this.updatePasswordwarning(passwordWarning)

        let noWarnings = (usernameWarning === '' && emailWarning === '' && !passwordWarning.hasWarnings)
        let fieldsPopulated = this._usernameField.value !== '' && this._emailField.value !== '' && this._passwordField.value !== ''

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
        }
    }
}

module.exports = CreateAccountView