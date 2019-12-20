const BasePresenter = require('./basepresenter.js')

class LoadingPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this._models.get('loading').onItemLoaded.register(this.itemLoaded.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    loadingComplete() {
        this._models.get('loading').loadingComplete()
    }

    itemLoaded(progress) {
        this._view.updateProgress(progress)
    }
}

module.exports = LoadingPresenter