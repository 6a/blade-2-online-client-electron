const BasePresenter = require('./basepresenter.js')

class HomePresenter extends BasePresenter {
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

module.exports = HomePresenter