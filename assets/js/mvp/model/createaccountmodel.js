const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class CreateAccountModel extends BaseModel {
    constructor () {
        super('createaccount')
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this._models.get('login').onCreateAccountModalRequested.register(this.show.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    closeClicked() {
        this.hide()
    }
}

module.exports = CreateAccountModel