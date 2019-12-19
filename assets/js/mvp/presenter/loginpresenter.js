const BasePresenter = require('./basepresenter.js')

class LoginPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventRef(this._models.get('loading').onLoadingComplete.register(this.onLoadingComplete.bind(this)))
        this.addEventRef(this._models.get('login').onInputFieldWarningChanged.register(this.onInputFieldWarningChanged.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    usernameFieldChanged(username) {
        this._models.get('login').usernameFieldChanged(username)
    }

    passwordFieldChanged(password) {
        this._models.get('login').passwordFieldChanged(password)
    }

    submit(username, password) {
        this._models.get('login').submit(username, password)
    }

    onLoadingComplete() {
        this._view.startBackgroundVideo()
    }

    onInputFieldWarningChanged(data) {
        this._view.updateInputWarnings(data.usernameWarning, data.passwordWarning)
    }
}

module.exports = LoginPresenter