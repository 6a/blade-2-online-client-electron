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
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('create-account')
    }
}

module.exports = CreateAccountView