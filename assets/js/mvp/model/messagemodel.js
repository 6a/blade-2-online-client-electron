const BaseModel = require('./basemodel.js')
const { B2Event } = require('../utility')

class MessageModal extends BaseModel {
    constructor () {
        super('message')
        this.init()
        this._active = false
    }

    init() {
        super.init()

        this.onShow = new B2Event('Show Message')

        // this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.processCreateAccountResponse.bind(this)))
        
        // document.getElementById("opts-button").addEventListener("click", this.onOptionsClicked.bind(this), false);
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).show()
        this.hide()
    }

    open(opts) {
        this.onShow.broadcast(opts)
        this.show()
    }
}

module.exports = MessageModal