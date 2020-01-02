const BasePresenter = require('./basepresenter.js')

class OptionsPresenter extends BasePresenter {
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
}

module.exports = OptionsPresenter