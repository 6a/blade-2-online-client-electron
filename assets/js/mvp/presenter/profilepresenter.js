const BasePresenter = require('./basepresenter.js')

class ProfilePresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()
    }
    
    closeForm() {
        this.model.closeForm()
    }

}

module.exports = ProfilePresenter