const BaseModel = require('./basemodel.js')
const { B2Event, Localization, containers } = require('../utility')
const Settings = require('../../utility/settings')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const Timer = require('../../utility/timer')

class LobbyModel extends BaseModel {
    constructor () {
        super('lobby')
        this.init()
    }

    init() {
        super.init()

        this.onMatchMakingQueueJoined = new B2Event('MatchMaking Queue Joined')

        this.addEventListener(this.models.get('lobbyloader').onLobbyReady.register(this.onLobbyReady.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingConnectComplete.register(this.onMatchMakingConnectComplete.bind(this)))

        // this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.processCreateAccountResponse.bind(this)))
        
        // document.getElementById("opts-button").addEventListener("click", this.onOptionsClicked.bind(this), false);

        // this._active = false
    }

    destroy() {
        super.destroy()
    }

    onLobbyReady() {
        this.show()
    }

    startMatchMaking() {
        this.models.get('net').startMatchMaking()
    }

    onMatchMakingConnectComplete(error) {
        if (error === "") {
            this.onMatchMakingQueueJoined.broadcast()
        } else {
            this.onMatchMakingFailed.broadcast(error)
        }
    }
}

module.exports = LobbyModel