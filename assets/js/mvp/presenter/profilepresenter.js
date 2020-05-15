const BasePresenter = require('./basepresenter.js')

class ProfilePresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onMatcHistoryResponse.register(this.onMatchHistoryResponse.bind(this)))
    }
    
    closeForm() {
        this.model.closeForm()
    }

    onMatchHistoryResponse(response) {
        this._view.updateMatchHistory(response.publicID, response.history)
    }

    requestMatchHistory()
    {
        this.model.requestMatchHistory()
    }

}

module.exports = ProfilePresenter