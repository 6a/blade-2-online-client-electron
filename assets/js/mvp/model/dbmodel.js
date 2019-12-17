const BaseModel = require('./basemodel.js')

class DBModel extends BaseModel {
    constructor () {
        super("db")
        this.init()

    }

    init() {
        super.init()


    }

    destroy() {
        super.destroy()
    }
}

module.exports = DBModel