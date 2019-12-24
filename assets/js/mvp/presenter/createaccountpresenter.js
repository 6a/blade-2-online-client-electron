const BasePresenter = require('./basepresenter.js')

class CreateAccountPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this._models.get('createaccount').onSetActive.register(this.onSetActive.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    closeClicked() {
        this._models.get('createaccount').closeClicked()
        this._models.get('login').show()
    }

    usernameFieldChanged(username) {

    }

    emailFieldchanged(email) {

    }

    passwordFieldChanged(password) {

    }
}

module.exports = CreateAccountPresenter