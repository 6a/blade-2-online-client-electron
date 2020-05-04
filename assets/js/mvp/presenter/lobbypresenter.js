const BasePresenter = require('./basepresenter.js')

class LobbyPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()
        
        this.addEventListener(this.model.onMatchMakingQueueJoined.register(this.onMatchMakingQueueJoined.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    playClicked() {
        this.model.playClicked()
    }

    startMatchMaking() {
        this.model.startMatchMaking()
    }

    onMatchMakingQueueJoined() {
        this._view.onMatchMakingQueueJoined()
    }
}

module.exports = LobbyPresenter