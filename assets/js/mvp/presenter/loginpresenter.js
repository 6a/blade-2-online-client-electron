const BasePresenter = require('./basepresenter.js')

class LoginPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventRef(this._models.get('loading').onLoadingComplete.register(this.onLoadingComplete.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    onLoadingComplete() {
        this._view.startBackgroundVideo()
    }
}

module.exports = LoginPresenter