const BasePresenter = require('./basepresenter.js')

class CreateAccountPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this._models.get('createaccount').onSetActive.register(this.setActive.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    setActive(active) {
        this._view.setActive(active)
    }
}

module.exports = CreateAccountPresenter