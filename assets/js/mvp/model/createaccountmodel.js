const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class CreateAccountModel extends BaseModel {
    constructor () {
        super('createaccount')
        this.init()
    }

    init() {
        super.init()

        this.onSetActive = new B2Event('Set Active')

        this.addEventListener(this._models.get('login').onCreateAccountModalRequested.register(this.show.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    show() {
        this.onSetActive.broadcast(true)
    }

    hide() {
        this.onSetActive.broadcast(false)
    }
}

module.exports = CreateAccountModel