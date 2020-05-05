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
    }

    destroy() {
        super.destroy()
    }

    playClicked() {
        this.model.playClicked()
    }

    requestBackgroundVideoActive() {
        this.model.requestBackgroundVideoActive()
    }

    onMatchMakingStarted() {
        this._view.onMatchMakingStarted()
    }

    onMatchMakingQueueJoined() {
        this._view.onMatchMakingQueueJoined()
    }

    onMatchMakingReadyCheckStarted() {
        this._view.onMatchMakingReadyCheckStarted()
    }

    onToggleBackgroundVideo(disabled) {
        this._view.toggleBackgroundVideo(disabled)
    }
}

module.exports = LobbyPresenter