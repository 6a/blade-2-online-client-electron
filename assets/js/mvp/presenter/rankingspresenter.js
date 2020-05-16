const BasePresenter = require('./basepresenter.js')

class RankingsPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onRankingsDataResponse.register(this.onRankingsDataResponse.bind(this)))
    }
    
    closeForm() {
        this.model.closeForm()
    }

    onRankingsDataResponse(data) {
        this._view.updateRankings(data)
    }

    requestRankings() {
        this.model.requestRankings()
    }
}

module.exports = RankingsPresenter