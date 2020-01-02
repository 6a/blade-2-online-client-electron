const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class OptionsModel extends BaseModel {
    constructor () {
        super('options')
        this.init()
        this._active = false
    }

    init() {
        super.init()

        // this.onInputFieldWarningChanged = new B2Event('Input Field State Changed')

        // this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.processCreateAccountResponse.bind(this)))
        
        document.getElementById("opts-button").addEventListener("click", this.onOptionsClicked.bind(this), false);
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).show()
        this.hide()
    }

    onOptionsClicked() {
        if (!this._active) {
            this.models.peekCurrentObject().setLocked(true)
            this.show()
        }
    }
}

module.exports = OptionsModel