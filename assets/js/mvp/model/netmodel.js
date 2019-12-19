const BaseModel = require('./basemodel.js')

class NetModel extends BaseModel {
    constructor () {
        super('net')
        this.init()
    }

    init() {
        super.init()

        this.onAuthRequestResponse = new B2Event('authrequestresponse')
    }

    destroy() {
        super.destroy()
    }

    sendAuthRequest(username, password) {
        console.error("sendAuthRequest() not implemented")
    }
}

module.exports = NetModel