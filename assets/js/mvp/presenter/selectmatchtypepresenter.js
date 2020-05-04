const BasePresenter = require('./basepresenter.js')

class SelectMatchTypePresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()
    }

    destroy() {
        super.destroy()
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