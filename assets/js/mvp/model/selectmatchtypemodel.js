const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class SelectMatchTypeModel extends BaseModel {
    constructor () {
        super('selectmatchtype')
        this.init()
    }

    init() {
        super.init()

        this.onInputFieldWarningChanged = new B2Event('Input Field State Changed')

        this.addEventListener(this.models.get('lobby').onMatchSelectModalSelected.register(this.show.bind(this)))

        this._active = false
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }
}

module.exports = SelectMatchTypeModel