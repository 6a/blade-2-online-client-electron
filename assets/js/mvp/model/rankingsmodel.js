const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class RankingsModel extends BaseModel {
    constructor () {
        super('rankings')
        this.init()
    }

    init() {
        super.init()

        this.onRankingsDataResponse = new B2Event('Match History Response')

        this.addEventListener(this.models.get('net').onGetRankingsResponse.register(this.processRankingsDataResponse.bind(this)))

        this._active = false
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }

    requestRankings() {
        this.models.get('net').sendRankingsRequest()
    }

    processRankingsDataResponse(response) {
        let rankings = null
        let userData = null

        if (response.code === 0) {
            rankings = response.payload.leaderboards
            userData = response.payload.user.pid === '' ? null : response.payload.user
        }

        this.onRankingsDataResponse.broadcast({ rankings: rankings, user: userData })
    }
}

module.exports = RankingsModel