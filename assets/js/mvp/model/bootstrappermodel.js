const { execFile } = require('child_process')
const BaseModel = require('./basemodel.js')
const { B2Event } = require('../utility')
const FileWriter = require('../../utility/filewriter')

const RANKED_MATCH_DELAY = 5000
const LAUNCH_FILE_DELIMITER = ':'
const LAUNCH_FILE_PATH = "./assets/game/BladeIIGame/Content/BladeIIGame/Data/Launch.conf"
const GAME_EXECUTABLE_PATH = "./assets/game/BladeIIGame.exe"

class BootStrapperModel extends BaseModel {
    constructor () {
        super('bootstrapper')
        this.init()
    }

    init() {
        super.init()

        this.onLaunchFailed = new B2Event(`Launch Failed`)
        this.onGameClosed = new B2Event(`Game Closed`)

        this.addEventListener(this.models.get('net').onMatchMakingGameConfirmed.register(this.requestRankedMatch.bind(this)))

        this._delayedStartHandle
        this._launchFileWriteTimeStart
        this._isBootStrappingRankedGame = false
    }

    destroy() {
        super.destroy()
    }

    requestTutorial() {
        console.log(`Starting Tutorial`)
        this._isBootStrappingRankedGame = false

        this.writeLaunchConfig(10)
    }

    requestAIMatch() {
        console.log(`Starting AI Match`)
        this._isBootStrappingRankedGame = false

        this.writeLaunchConfig(0)
    }

    requestRankedMatch(matchID) {
        console.log(`Starting match with id [${matchID}]`)
        this._isBootStrappingRankedGame = true

        this.writeLaunchConfig(matchID)
    }

    writeLaunchConfig(matchID) {
        this._launchFileWriteTimeStart = Date.now()
        let fileWriter = new FileWriter(LAUNCH_FILE_PATH)
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

    launchGameExecutable() {
        console.log("Launching...")

        execFile(GAME_EXECUTABLE_PATH, this.execFileCallback.bind(this))

        document.requestHideToTray()
    }

    execFileCallback(err, data) {
        if (err) {
            console.log(err)
        } 
        
        this.onGameClosed.broadcast(!err)
        document.requestShowFromTray()
    }

    delayedStart() {
        let now = Date.now()
        let remainingDelay = this._isBootStrappingRankedGame ? RANKED_MATCH_DELAY - (now - this._launchFileWriteTimeStart) : 100

        if (now - this._launchFileWriteTimeStart > RANKED_MATCH_DELAY) {
            this.onLaunchFailed.broadcast("Failed to write to launch file (Timed Out)")
        }

        this._delayedStartHandle = setTimeout(function () {
            this.launchGameExecutable()
        }.bind(this), remainingDelay);
    }
}

module.exports = BootStrapperModel