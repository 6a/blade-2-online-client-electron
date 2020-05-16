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
        this.onProfileDataResponse = new B2Event('Profile Data Response')

        this.addEventListener(this.models.get('net').onMatchHistoryResponse.register(this.processMatchHistoryResponse.bind(this)))
        this.addEventListener(this.models.get('net').onGetProfileResponse.register(this.processProfileDataResponse.bind(this)))

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

    requestProfile() {
        this.models.get('net').sendProfileRequest()
    }

    requestAvatarUpdate(avatar) {
        this.models.get('net').sendAvatarUpdateRequest(avatar)
    }

    processMatchHistoryResponse(response) {
        let history = null

        if (response.code === 0) {
            if (response.payload.rows) {
                history = response.payload.rows
            } else {
                history = []
            }
        }

        this.onMatcHistoryResponse.broadcast({ publicID: this.models.get('net').getPublicID(), history: history})
    }

    processProfileDataResponse(response) {
        let data = null

        if (response.code === 0) {
            if (response.payload) {
                data = response.payload
            } else {
                data = {}
            }
        }

        this.onProfileDataResponse.broadcast({ handle: this.models.get('net').getHandle(), data: data})
    }
}

module.exports = ProfileModel