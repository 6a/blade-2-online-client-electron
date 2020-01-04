const BasePresenter = require('./basepresenter.js')

class OptionsPresenter extends BasePresenter {
    constructor (view) {
        super(view)
        this.init()
    }

    init() {
        super.init()

        this.addEventListener(this.model.onSettingsReady.register(this.onSettingsReady.bind(this)))
        this.addEventListener(this.model.onLicenseInfoReady.register(this.onLicenseInfoReady.bind(this)))
        this.addEventListener(this.model.onTermsOfUseReady.register(this.onTermsOfUseReady.bind(this)))
        this.addEventListener(this.model.onAboutReady.register(this.onAboutReady.bind(this)))
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.model.closeForm()
    }

    requestSettings() {
        this.model.loadSettings()
    }

    requestLicenses() {
        this.model.loadLicenses()
    }

    requestTermsOfUse() {
        this.model.loadTermsOfUse()
    }

    requestAbout() {
        this.model.loadAbout()
    }

    requestSettingsReset() {
        this.model.resetSettings()  
    }

    settingChanged(setting, newValue) {
        this.model.settingChanged(setting, newValue)
    }

    showResetMessage(positiveCallback) {
        this.model.showResetMessage(positiveCallback)
    }

    onSettingsReady(settings) {
        this._view.setSettings(settings)
    }

    onLicenseInfoReady(licenses) {
        this._view.setLicenseInfo(licenses)
    }

    onTermsOfUseReady() {
        this._view.updateTermsOfUse()
    }

    onAboutReady() {
        this._view.updateAbout()
    }
}

module.exports = OptionsPresenter