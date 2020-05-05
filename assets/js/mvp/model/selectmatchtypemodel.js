const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class SelectMatchTypeModel extends BaseModel {
    constructor () {
        super('selectmatchtype')
        this.init()
    }

    init() {
        super.init()

        this.onLocalMatchStarted = new B2Event('Local Match Started')

        this.addEventListener(this.models.get('lobby').onMatchSelectModalSelected.register(this.show.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingConnectComplete.register(this.onMatchMakingConnectComplete.bind(this)))

        this._active = false
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }

    requestTutorial() {
        this.models.get('bootstrapper').requestTutorial()
        this.models.get('lobby').enablePlay()
    }

    requestAIMatch() {
        this.models.get('bootstrapper').requestAImatch()
        this.models.get('lobby').enablePlay()
    }

    requestRankedMatch() {
        this.models.get('net').startMatchMaking()
    }

    onMatchMakingConnectComplete(error) {
        if (error === "") {
            
        }
    }
}

module.exports = SelectMatchTypeModel