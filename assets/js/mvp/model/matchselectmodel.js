const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class MatchSelectModel extends BaseModel {
    constructor () {
        super('matchselect')
        this.init()
    }

    init() {
        super.init()

        this.onLocalMatchStarted = new B2Event('Local Match Started')

        this.addEventListener(this.models.get('lobby').onMatchSelectModalSelected.register(this.show.bind(this)))

        this._active = false
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.models.get('lobby').enableInteractions()
        this.hide()
    }

    requestTutorial() {
        this.models.get('bootstrapper').requestTutorial()
        this.models.get('lobby').enableInteractions()

        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }

    requestAIMatch() {
        this.models.get('bootstrapper').requestAIMatch()
        this.models.get('lobby').enableInteractions()

        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }

    requestRankedMatch() {
        this.models.get('net').startMatchMaking()

        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }

    onMatchMakingConnectComplete(error) {

    }
}

module.exports = MatchSelectModel