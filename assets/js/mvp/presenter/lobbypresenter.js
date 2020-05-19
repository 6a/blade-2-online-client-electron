const BasePresenter = require('./basepresenter.js')

class LobbyPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        
        
        this.addEventListener(this.model.onMatchMakingStarted.register(this.onMatchMakingStarted.bind(this)))
        this.addEventListener(this.model.onMatchMakingQueueJoined.register(this.onMatchMakingQueueJoined.bind(this)))
        this.addEventListener(this.model.onMatchMakingReadyCheckStarted.register(this.onMatchMakingReadyCheckStarted.bind(this)))
        this.addEventListener(this.model.onToggleBackgroundVideo.register(this.onToggleBackgroundVideo.bind(this)))
        this.addEventListener(this.model.onMatchMakingOpponentReady.register(this.onMatchMakingOpponentReady.bind(this)))
        this.addEventListener(this.model.onMatchMakingComplete.register(this.onMatchMakingComplete.bind(this)))
        this.addEventListener(this.model.onMatchMakingOpponentFailedReadyCheck.register(this.onMatchMakingOpponentFailedReadyCheck.bind(this)))
        this.addEventListener(this.model.onMatchMakingFailedReadyCheck.register(this.onMatchMakingFailedReadyCheck.bind(this)))    
    }

    playClicked() {
        this.model.playClicked()
    }

    profileClicked() {
        this.model.profileClicked()
    }

    rankingsClicked() {
        this.model.rankingsClicked()
    }

    homeClicked() {
        this.model.homeClicked()
    }

    requestBackgroundVideoActive() {
        this.model.requestBackgroundVideoActive()
    }

    acceptReadyCheck() {
        this.model.acceptReadyCheck()
    }

    onMatchMakingStarted() {
        this._view.matchMakingStarted()
    }

    onMatchMakingQueueJoined() {
        this._view.matchMakingQueueJoined()
    }

    onMatchMakingReadyCheckStarted() {
        this._view.matchMakingReadyCheckStarted()
    }

    onMatchMakingOpponentReady() {
        this._view.matchMakingOpponentReady()
    }

    onMatchMakingComplete() {
        this._view.matchMakingComplete()
    }

    onMatchMakingOpponentFailedReadyCheck() {
        this._view.opponentFailedReadyCheck()
    }

    onMatchMakingFailedReadyCheck() {
        this._view.failedReadyCheck()
    }

    onToggleBackgroundVideo(disabled) {
        this._view.toggleBackgroundVideo(disabled)
    }
}

module.exports = LobbyPresenter