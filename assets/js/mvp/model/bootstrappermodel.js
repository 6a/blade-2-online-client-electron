const BaseModel = require('./basemodel.js')
const { B2Event } = require('../utility')

class BootStrapperModel extends BaseModel {
    constructor () {
        super('bootstrapper')
        this.init()
    }

    init() {
        super.init()

    }

    destroy() {
        super.destroy()
    }

    startTutorial() {

    }

    startAIMatch() {
        
    }

    startRankedMatch() {
        
    }
}

module.exports = BootStrapperModel