const BaseModel = require('./basemodel.js')
const { B2Event, FileWriter } = require('../utility')

const RANKED_MATCH_DELAY = 5000
const LAUNCH_FILE_DELIMITER = ':'

class BootStrapperModel extends BaseModel {
    constructor () {
        super('bootstrapper')
        this.init()
    }

    init() {
        super.init()

        this.onLaunchFailed = new B2Event(`Launch Failed`)
        this.addEventListener(this.models.get('net').onMatchMakingGameConfirmed.register(this.requestRankedMatch.bind(this)))

        this._delayedStartHandle
        this._launchFileWriteTimeStart
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

        this._launchFileWriteTimeStart = Date.now()
        let fileWriter = new FileWriter('launch.conf')
        let config = this.models.get('options').getLaunchConfigData()
        let userSettings = this.models.get('net').getLaunchConfigData()
        let dataToWrite = userSettings.concat([matchID], config)

        fileWriter.writeDelimited(dataToWrite, LAUNCH_FILE_DELIMITER, this.launchConfigWriteCallback.bind(this))
    }

    launchConfigWriteCallback(error) {
        if (error) {
            this.onLaunchFailed.broadcast("Failed to write to launch file: " + error)
        }
        
        this.delayedStart()
    }

    delayedStart() {
        let now = Date.now()
        let remainingDelay = RANKED_MATCH_DELAY - (now - this._launchFileWriteTimeStart)

        if (now - this._launchFileWriteTimeStart > RANKED_MATCH_DELAY) {
            this.onLaunchFailed.broadcast("Failed to write to launch file (Timed Out)")
        }

        this._delayedStartHandle = setTimeout(function () {
            console.log("Launching...")
        }, remainingDelay);
    }
}

module.exports = BootStrapperModel