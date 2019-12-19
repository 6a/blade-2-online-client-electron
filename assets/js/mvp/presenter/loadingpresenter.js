const BasePresenter = require('./basepresenter.js')
const LoadingView = require('../view/loadingview.js')

class LoadingPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this._models.get('loading').onItemLoaded.register(this.onItemLoaded.bind(this))
    }

    destroy() {
        super.destroy()
    }

    onItemLoaded(progress) {
        this._view.updateProgress(progress)
    }
}

module.exports = LoadingPresenter