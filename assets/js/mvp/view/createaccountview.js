const BaseView = require('./baseview.js')
const CreateAccountPresenter = require('../presenter/createaccountpresenter.js')

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
        this._passwordReq15Chars= document.getElementById('create-account-password-req-15-chars')
        this._passwordReq8Chars= document.getElementById('create-account-password-req-8-chars')
        this._passwordReq1Numeral= document.getElementById('create-account-password-req-1-numeral')
        this._passwordReq1LowerCase= document.getElementById('create-account-password-req-1-lowercase')

        this._showhidePasswordCheckbox = document.getElementById('create-account-showhide-password-toggle')

        this._submitButton = document.getElementById('create-account-button')
        this._detailsWrapper = document.getElementById('create-account-details-wrapper')
        this._closeButton = document.getElementById('create-account-close')
    }

    addEventListeners() {
        this._usernameField.addEventListener('input', this.onUsernameFieldChanged.bind(this), false)

        this._closeButton.addEventListener('click', this.onCloseClicked.bind(this), false)
    }

    removeEventListeners() {
        this._usernameField.removeEventListener('input', this.onUsernameFieldChanged.bind(this), false)

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
        let username = this._usernameField.value

        this._presenter.usernameFieldChanged(username)
    }

    setPasswordInfoStyle(element, className) {
        const classes = ['ca-li-inactive', 'ca-li-pass', 'ca-li-fail']
        classes.forEach((c) => {
            element.classList.remove(c)
        })

        element.classList.add(className)
    }

    setActive(active) {
        super.setActive(active)

        new Promise(r => setTimeout(r, 400))
        .then(() => {
            this.resetForm()
        })
    }
}

module.exports = CreateAccountView