const BasePresenter = require('./basepresenter.js')

class CreateAccountPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onInputFieldWarningChanged.register(this.onInputFieldWarningChanged.bind(this)))
        this.addEventListener(this.model.onCreationSuccess.register(this.onCreationSuccess.bind(this)))
        this.addEventListener(this.model.onServerErrorDialogue.register(this.onServerErrorDialogue.bind(this)))
        this.addEventListener(this.model.onCreationError.register(this.onCreationError.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.model.closeForm()
    }

    usernameFieldChanged(value) {
        this.model.usernameFieldChanged(value)
    }

    emailFieldChanged(value) {
        this.model.emailFieldChanged(value)
    }

    passwordFieldChanged(value) {
        this.model.passwordFieldChanged(value)
    }

    submit(username, email, password) {
        this.model.submit(username, email, password)
    }

    updateStoredUsername(username) {
        this.model.updateStoredUsername(username)
    }

    onInputFieldWarningChanged(warnings) {
        this._view.updateWarnings(warnings)
    }

    onCreationSuccess(username) {
        this._view.showSuccessDialogue(username)
    }

    onServerErrorDialogue(error) {
        this._view.showServerErrorDialogue(error)
    }

    onCreationError(data) {
        this._view.displayCreationErrors(data.target, data.message)
    }
}

module.exports = CreateAccountPresenter