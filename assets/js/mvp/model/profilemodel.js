const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class ProfileModel extends BaseModel {
    constructor () {
        super('profile')
        this.init()
    }

    init() {
        super.init()

        this.onMatcHistoryResponse = new B2Event('Match History Response')

        this.addEventListener(this.models.get('net').onMatchHistoryResponse.register(this.processMatchHistoryResponse.bind(this)))

        this._active = false
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }

    requestMatchHistory() {
        this.models.get('net').sendMatchHistoryRequest()
    }

    processMatchHistoryResponse(response) {
        this.onMatcHistoryResponse.broadcast({ publicID: this.models.get('net').getPublicID(), history: response.code === 0 ? response.payload.rows : null})
    }
}

module.exports = ProfileModel