const BasePresenter = require('./basepresenter.js')

class CreateAccountPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onSetActive.register(this.onSetActive.bind(this)))
        this.addEventListener(this.model.onInputFieldWarningChanged.register(this.onInputFieldWarningChanged.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    closeClicked() {
        this._models.get('createaccount').closeClicked()
        this._models.get('login').show()
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

    onInputFieldWarningChanged(warnings) {
        this._view.updateWarnings(warnings)
    }
}

module.exports = CreateAccountPresenter