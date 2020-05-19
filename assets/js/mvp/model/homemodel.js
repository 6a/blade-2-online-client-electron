const BaseModel = require('./basemodel.js')

class HomeModel extends BaseModel {
    constructor () {
        super('home')
        this.init()
    }

    init() {
        super.init()

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

module.exports = HomeModel