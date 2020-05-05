const BaseModel = require('./basemodel.js')
const { B2Event } = require('../utility')

const RANKED_MATCH_DELAY = 5000

class BootStrapperModel extends BaseModel {
    constructor () {
        super('bootstrapper')
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.models.get('net').onMatchMakingGameConfirmed.register(this.requestRankedMatch.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    requestTutorial() {
        console.log(`Starting Tutorial`)
    }

    requestAImatch() {
        console.log(`Starting AI Match`)
    }

    requestRankedMatch(matchID) {
        console.log(`Starting match with id [${matchID}]`)

        // Delay for 2s then start bootstrap
    }
}

module.exports = BootStrapperModel