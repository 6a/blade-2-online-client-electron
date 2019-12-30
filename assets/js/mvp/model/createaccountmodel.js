const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const Validation = require('../utility').Validation
const Localization = require('../utility').Localization
const PasswordWarningState = require('../utility').Containers.PasswordWarningState

class CreateAccountModel extends BaseModel {
    constructor () {
        super('createaccount')
        this.init()
    }

    init() {
        super.init()

        this.onInputFieldWarningChanged = new B2Event('Input Field State Changed')
        this.onCreationSuccess = new B2Event('Account Creation Success')
        this.onServerErrorDialogue = new B2Event('ServerError')
        this.onCreationError = new B2Event('Account Creation Error')

        this._usernameWarning = ''
        this._emailWarning = ''
        this._passwordWarning = new PasswordWarningState()

        this.addEventListener(this._models.get('login').onCreateAccountModalRequested.register(this.show.bind(this)))
        this.addEventListener(this._models.get('net').onCreateAccountResponse.register(this.processCreateAccountResponse.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    closeClicked() {
        this.hide()
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
            this._usernameWarning = Localization.get('usernameTooShort')
        } else if (!Validation.noSpaceAtStart.test(username)) {
            this._usernameWarning = Localization.get('usernameCantStartWithSpace')
        } else if (!Validation.usernameValidChars.test(username)) {
            this._usernameWarning = Localization.get('usernameIllegalChars')
        } 
    }

    determineEmailWarning(email) {
        this._emailWarning = ''
        
        if (email.length < 5 || !Validation.emailValidFormat.test(email)) {
            this._emailWarning = Localization.get('emailInvalid')
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
        this._models.get('net').sendCreateAccountRequest(username, email, password)
    }

    updateStoredUsername(username) {
        
    }

    processCreateAccountResponse(data) {
        if (data.code === 0) {
            this.onCreationSuccess.broadcast(data.message)
        } else if (data.code >= 0 && data.code < 200) {
            this.onServerErrorDialogue.broadcast(data.message)
        } else {
            let target = ""
            if (data.code >= 200 && data.code < 300) {
                target = "username"
            } else if (data.code >= 300 && data.code < 400) {
                target = "email"
            } else {
                target = "password"
            }

            this.onCreationError.broadcast({
                target: target,
                message: data.message
            })
        }
    }
}

module.exports = CreateAccountModel