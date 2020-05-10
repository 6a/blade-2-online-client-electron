const BasePresenter = require('./basepresenter.js')

class LoadingPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onItemLoaded.register(this.itemLoaded.bind(this)))
    }

    loadingComplete() {
        this.model.loadingComplete()
    }

    itemLoaded(progress) {
        this._view.updateProgress(progress)
    }
}

module.exports = LoadingPresenter