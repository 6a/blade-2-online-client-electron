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
    }

    destroy() {
        super.destroy()
    }

    playClicked() {
        this.model.playClicked()
    }

    onMatchMakingStarted() {
        this._view.onMatchMakingStarted()
    }

    onMatchMakingQueueJoined() {
        this._view.onMatchMakingQueueJoined()
    }
}

module.exports = LobbyPresenter