const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class ProfileModel extends BaseModel {
    constructor () {
        super('profile')
        this.init()
    }

    init() {
        super.init()

        // this.onLocalMatchStarted = new B2Event('Local Match Started')

        // this.addEventListener(this.models.get('lobby').onMatchSelectModalSelected.register(this.show.bind(this)))

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

module.exports = ProfileModel