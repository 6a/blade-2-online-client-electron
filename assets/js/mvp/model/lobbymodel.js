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

        this.onMatchMakingStarted = new B2Event('MatchMaking Started')
        this.onMatchMakingQueueJoined = new B2Event('MatchMaking Queue Joined')
        this.onMatchMakingReadyCheckStarted = new B2Event('MatchMaking Ready Check Started')
        this.onMatchSelectModalSelected = new B2Event('Match Select Modal Selected')
        this.onToggleBackgroundVideo = new B2Event('Toggle Background Video')

        // this.addEventListener(this.models.get('lobbyloader').onLobbyReady.register(this.onLobbyReady.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingConnectStarted.register(this.onMatchMakingConnectStarted.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingConnectComplete.register(this.onMatchMakingConnectComplete.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingGameFound.register(this.onMatchMakingGameFound.bind(this)))

        this.addEventListener(this.models.get('options').onSettingChanged.register(this.onSettingChanged.bind(this)))

        this.addEventListener(this.models.get('login').onLoginFinished.register(this.show.bind(this)))

        // this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.processCreateAccountResponse.bind(this)))
        
        // document.getElementById("opts-button").addEventListener("click", this.onOptionsClicked.bind(this), false);

        this._active = false

        this._playDisabled = false;
    }

    destroy() {
        super.destroy()
    }

    onLobbyReady() {
        this.show()
    }

    playClicked() {
        if (!this._playDisabled) {
            this.setLocked(true)
            this.onMatchSelectModalSelected.broadcast()
            this._playDisabled = true
        }
    }

    onMatchMakingConnectStarted() {
        this.onMatchMakingStarted.broadcast()
    }

    onMatchMakingConnectComplete(error) {
        if (error === "") {
            this.onMatchMakingQueueJoined.broadcast()
        } else {
            this._playDisabled = false
        }
    }

    onMatchMakingGameFound() {
        this.onMatchMakingReadyCheckStarted.broadcast()
    }

    onSettingChanged(setting) {
        if (setting.setting === 'disableBackgroundVideos') {
            this.onToggleBackgroundVideo.broadcast(setting.newValue)
        }
    }
}

module.exports = LobbyModel