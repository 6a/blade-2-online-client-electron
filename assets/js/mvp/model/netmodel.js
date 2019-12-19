const BaseModel = require('./basemodel.js')

class NetModel extends BaseModel {
    constructor () {
        super('net')
        this.init()
        
    }

    init() {
        super.init()


    }

    destroy() {
        super.destroy()
    }
}

module.exports = NetModel