const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const Validation = require('../utility').Validation
const PasswordWarningState = require('../utility').containers.PasswordWarningState

class CreateAccountModel extends BaseModel {
    constructor () {
        super('createaccount')
        this.init()
    }

    init() {
        super.init()

        this.onInputFieldWarningChanged = new B2Event('Input Field State Changed')
        this.onCreationSuccess = new B2Event('Account Creation Success')
        this.onServerErrorDialogue = new B2Event('Server Error')
        this.onCreationError = new B2Event('Account Creation Error')

        this.resetWarnings()

        this.addEventListener(this.models.get('login').onCreateAccountModalRequested.register(this.show.bind(this)))
        this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.processCreateAccountResponse.bind(this)))

        this._active = false
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
        this.resetWarnings()
    }

    resetWarnings() {
        this._usernameWarning = this._emailWarning = ''
        this._passwordWarning = new PasswordWarningState()
    }

    broadcastInputFieldWarnings() {
        this.onInputFieldWarningChanged.broadcast({ 
            usernameWarning: this._usernameWarning,
            emailWarning: this._emailWarning,
            passwordWarning: this._passwordWarning
        })
    }

    determineUsernameWarning(username) {
        this._usernameWarning = ''
        
        if (username.length < 2) {
            this._usernameWarning = 'usernameTooShort'
        } else if (!Validation.noSpaceAtStart.test(username)) {
            this._usernameWarning = 'usernameCantStartWithSpace'
        } else if (!Validation.usernameValidChars.test(username)) {
            this._usernameWarning = 'usernameIllegalChars'
        } 
    }

    determineEmailWarning(email) {
        this._emailWarning = ''
        
        if (email.length < 5 || !Validation.emailValidFormat.test(email)) {
            this._emailWarning = 'emailInvalid'
        } 
    }

    determinePasswordWarning(password) {
        this._passwordWarning = new PasswordWarningState()

        if (!Validation.passwordValidChars.test(password) && password.length > 0) {
            this._passwordWarning.ascii = PasswordWarningState.FAIL
        } else {
            this._passwordWarning.ascii = PasswordWarningState.PASS

            if (password.length >= 15) {
                this._passwordWarning.fifteenChars = PasswordWarningState.PASS
            } else {
                let isLongEnough = password.length >= 8
                let hasNumeral = Validation.numberAny.test(password)
                let hasLowerCase = Validation.lowercaseAny.test(password)

                this._passwordWarning.eightChars = isLongEnough ? PasswordWarningState.PASS : PasswordWarningState.FAIL
                this._passwordWarning.oneNumeral = hasNumeral ? PasswordWarningState.PASS : PasswordWarningState.FAIL
                this._passwordWarning.oneLowerCase = hasLowerCase ? PasswordWarningState.PASS : PasswordWarningState.FAIL
            }
        }
    }

    usernameFieldChanged(value) {
        this.determineUsernameWarning(value)

        this.broadcastInputFieldWarnings()
    }

    emailFieldChanged(value) {
        this.determineEmailWarning(value)

        this.broadcastInputFieldWarnings()
    }

    passwordFieldChanged(value) {
        this.determinePasswordWarning(value)

        this.broadcastInputFieldWarnings()
    }

    submit(username, email, password) {
        this.models.get('net').sendCreateAccountRequest(username, email, password)
    }

    processCreateAccountResponse(response) {
        if (response.code === 0) {
            this.onCreationSuccess.broadcast(response.payload.handle)
        } else if (response.code === 9999 || (response.code >= 0 && response.code < 200)) {
            this.onServerErrorDialogue.broadcast(response.payload)
        } else {
            let target = ""
            if (response.code >= 200 && response.code < 300) {
                target = "username"
            } else if (response.code >= 300 && response.code < 400) {
                target = "email"
            } else {
                target = "password"
            }

            this.onCreationError.broadcast({
                target: target,
                message: response.payload
            })
        }
    }
}

module.exports = CreateAccountModel