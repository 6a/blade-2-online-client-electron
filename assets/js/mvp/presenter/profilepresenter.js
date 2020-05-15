const BasePresenter = require('./basepresenter.js')

class ProfilePresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onMatcHistoryResponse.register(this.onMatchHistoryResponse.bind(this)))
        this.addEventListener(this.model.onProfileDataResponse.register(this.onProfileDataResponse.bind(this)))
    }
    
    closeForm() {
        this.model.closeForm()
    }

    onMatchHistoryResponse(response) {
        this._view.updateMatchHistoryData(response.publicID, response.history)
    }

    onProfileDataResponse(response) {
        this._view.updateProfileData(response.handle, response.data)
    }

    requestMatchHistory() {
        this.model.requestMatchHistory()
    }

    requestProfile() {
        this.model.requestProfile()
    }

}

module.exports = ProfilePresenter