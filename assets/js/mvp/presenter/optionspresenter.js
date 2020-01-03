const BasePresenter = require('./basepresenter.js')

class OptionsPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onLicenseInfoReady.register(this.onLicenseInfoReady.bind(this)))
        this.addEventListener(this.model.onTermsOfUseReady.register(this.onTermsOfUseReady.bind(this)))
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

    requestTermsOfUse() {
        this.model.requestTermsOfUse()
    }

    onLicenseInfoReady(licenses) {
        this._view.setLicenseInfo(licenses)
    }

    onTermsOfUseReady() {
        this._view.updateTermsOfUse()
    }
}

module.exports = OptionsPresenter