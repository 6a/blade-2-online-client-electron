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

        this.onMatchSelectModalSelected = new B2Event('Match Select Modal Selected')

        this.onMatchMakingStarted = new B2Event('MatchMaking Started')
        this.onMatchMakingQueueJoined = new B2Event('MatchMaking Queue Joined')

        this.onMatchMakingReadyCheckStarted = new B2Event('MatchMaking Ready Check Started')
        this.onMatchMakingOpponentReady = new B2Event('Matchmaking Opponent Accepted')
        this.onMatchMakingComplete = new B2Event('Matchmaking Complete')
        this.onMatchMakingOpponentFailedReadyCheck = new B2Event('Opponent Failed Ready Check')
        this.onMatchMakingFailedReadyCheck = new B2Event('Failed Ready Check')

        this.onToggleBackgroundVideo = new B2Event('Toggle Background Video')

        // this.addEventListener(this.models.get('lobbyloader').onLobbyReady.register(this.onLobbyReady.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingConnectStarted.register(this.onMatchMakingConnectStarted.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingConnectComplete.register(this.onMatchMakingConnectComplete.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingGameFound.register(this.onMatchMakingGameFound.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingOpponentAccepted.register(this.onMatchMakingOpponentAccepted.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingGameConfirmed.register(this.onMatchMakingGameConfirmed.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingOpponentFailedToAccept.register(this.onMatchMakingOpponentFailedToAccept.bind(this)))
        this.addEventListener(this.models.get('net').onMatchMakingFailedToAccept.register(this.onMatchMakingFailedToAccept.bind(this)))

        this.addEventListener(this.models.get('options').onSettingChanged.register(this.onSettingChanged.bind(this)))

        this.addEventListener(this.models.get('login').onLoginFinished.register(this.show.bind(this)))

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

    requestBackgroundVideoActive() {
        this.onToggleBackgroundVideo.broadcast(Settings.get(Settings.KEYS.DISABLE_BACKGROUND_VIDEOS))
    }

    acceptReadyCheck() {
        this.models.get('net').acceptReadyCheck()
    }

    enablePlay() {
        this._playDisabled = false
    }
    
    onMatchMakingConnectStarted() {
        this.onMatchMakingStarted.broadcast()
    }

    onMatchMakingConnectComplete(error) {
        if (error === "") {
            this.onMatchMakingQueueJoined.broadcast()
            console.log("onMatchMakingConnectComplete")
        } else {
            this._playDisabled = false
        }
    }

    onMatchMakingGameFound() {
        this.onMatchMakingReadyCheckStarted.broadcast()
    }

    onMatchMakingOpponentAccepted() {
        this.onMatchMakingOpponentReady.broadcast()
    }

    onMatchMakingGameConfirmed(matchID) {
        this.onMatchMakingComplete.broadcast()
        this._playDisabled = false
    }
    
    onMatchMakingOpponentFailedToAccept () {
        this.onMatchMakingOpponentFailedReadyCheck.broadcast()
    }

    onMatchMakingFailedToAccept() {
        this.onMatchMakingFailedReadyCheck.broadcast()
        this._playDisabled = false
    }

    onSettingChanged(setting) {
        console.log(setting)
        if (setting.setting === 'disableBackgroundVideos') {
            this.onToggleBackgroundVideo.broadcast(setting.newValue)
        }
    }
}

module.exports = LobbyModel