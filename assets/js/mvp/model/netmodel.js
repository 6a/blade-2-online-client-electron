const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class NetModel extends BaseModel {
    constructor () {
        super('net')
        this.init()
    }

    init() {
        super.init()

        this.onAuthRequestResponse = new B2Event('Auth Request Response', this.name)
    }

    destroy() {
        super.destroy()
    }

    sendAuthRequest(username, password) {
        console.error("sendAuthRequest() not implemented")
    }
}

module.exports = NetModel