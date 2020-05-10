const BasePresenter = require('./basepresenter.js')

class MessagePresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onShow.register(this.onShow.bind(this)))
    }

    closeForm() {
        this.model.closeForm()
    }

    onShow(opts) {
        this._view.show(opts)
    }
}

module.exports = MessagePresenter