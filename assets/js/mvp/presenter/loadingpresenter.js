const BasePresenter = require('./basepresenter.js')

class LoadingPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventRef(this._models.get('loading').onItemLoaded.register(this.onItemLoaded.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    loadingComplete() {
        this._models.get('loading').loadingComplete()
    }

    onItemLoaded(progress) {
        this._view.updateProgress(progress)
    }
}

module.exports = LoadingPresenter