const BasePresenter = require('./basepresenter.js')

class SelectMatchTypePresenter extends BasePresenter {
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

    requestTutorial() {
        this.model.requestTutorial()
    }

    requestAIMatch() {
        this.model.requestAIMatch()
    }

    requestRankedMatch() {
        this.model.requestRankedMatch()
    }
}

module.exports = SelectMatchTypePresenter