const BasePresenter = require('./basepresenter.js')

class OptionsPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onLicenseInfoReady.register(this.onLicenseInfoReady.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.model.closeForm()
    }

    requestLicenses() {
        this.model.requestLicenses()
    }

    onLicenseInfoReady(licenses) {
        this._view.setLicenseInfo(licenses)
    }
}

module.exports = OptionsPresenter