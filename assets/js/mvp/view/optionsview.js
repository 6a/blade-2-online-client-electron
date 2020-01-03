const BaseView = require('./baseview.js')
const OptionsPresenter = require('../presenter/optionspresenter.js')
const Localization = require('../utility').Localization
const MarkdownIt = require('markdown-it')

const CapitalizeFirstCharRegex = /^\w/

class OptionsView extends BaseView {
    constructor (viewsList) {
        super('options', OptionsPresenter, viewsList, 'hidden')
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
        this.addTabbables()
        this.requestSettings()
        this.requestLicenses()
        this.requestTermsOfUse()
        this.requestAbout()
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('options')
        this._title = document.getElementById('options-title')
        this._resetAnchor = document.getElementById('options-reset')
        this._doneButton = document.getElementById('options-done')
        this._nav = {
            general: document.getElementById('options-nav-general'),
            screen: document.getElementById('options-nav-screen'),
            sound: document.getElementById('options-nav-sound'),
            about: document.getElementById('options-nav-about'),
            termsOfUse: document.getElementById('options-nav-terms-of-use'),
            licenses: document.getElementById('options-nav-licenses'),
        }
        this._containers = {
            general: document.getElementById('options-general'),
            screen: document.getElementById('options-screen'),
            sound: document.getElementById('options-sound'),
            about: document.getElementById('options-about'),
            termsOfUse: document.getElementById('options-terms-of-use'),
            licenses: document.getElementById('options-licenses'),  
        }
        this._general = {
            language: document.getElementById('options-general-locale'), 
            masterVolume: document.getElementById('options-general-master-volume'),
            disableBackgroundVideos: document.getElementById('options-general-disable-dynamic-login-bg'),
        }
    }

    addEventListeners() {
        this._doneButton.addEventListener('click', this.onDoneButtonClicked.bind(this), false)
        this._resetAnchor.addEventListener('click', this.onResetAnchorClicked.bind(this), false)

        Object.values(this._general).forEach((element) => {
            element.addEventListener('input', this.onSettingChanged.bind(this), false)
        })     


        Object.values(this._nav).forEach((element) => {
            element.addEventListener('click', this.onNavButtonClicked.bind(this), false)
        })        
        
        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
    }

    removeEventListeners() {
        this._doneButton.removeEventListener('click', this.onDoneButtonClicked.bind(this), false)
        this._resetAnchor.removeEventListener('click', this.onResetAnchorClicked.bind(this), false)

        Object.values(this._nav).forEach((element) => {
            element.removeEventListener('click', this.onNavButtonClicked.bind(this), false)
        })

        document.removeEventListener('keydown', this.onKeyDown.bind(this), false)
    }

    addTabbables() {
        let tabbables = [
            this._doneButton,
            this._resetAnchor,
            ...Object.values(this._nav),
            ...Object.values(this._general),
        ]

        super.addTabbables(tabbables)
    }

    setContentPanel(target) {
        Object.values(this._containers).forEach((element) => {
            this.toggleHidden(element, true)
        })

        this.toggleHidden(this._containers[target], false)
    }

    setCurrentNavButton(target) {
        Object.values(this._nav).forEach((element) => {
            element.classList.remove('nav-button-current')
        })

        this._nav[target].classList.add('nav-button-current')
    }

    requestSettings() {
        this._presenter.requestSettings()
    }

    requestLicenses() {
        this._presenter.requestLicenses()
    }

    requestTermsOfUse() {
        this._presenter.requestTermsOfUse()
    }

    requestAbout() {
        this._presenter.requestAbout()
    }

    setSettings(settings) {
        // General 
        this._general.language.value = settings.general.locale
        this._general.masterVolume.value = settings.general.masterVolume
        this._general.disableBackgroundVideos.checked = settings.general.disableBackgroundVideos

        // Screen

        // Sound


    }

    setLicenseInfo(licenses) {
        let md = new MarkdownIt()
        let newContent = ""

        for (let index = 0; index < licenses.length; index++) {
            const markdown = licenses[index];
            let finalMarkdown = markdown.trim() 

            if (index < licenses.length - 1) {
                finalMarkdown += `\n\n---\n`
            }

            let html = md.render(finalMarkdown)
            newContent += html
        }

        this._containers.licenses.innerHTML = newContent
    }

    updateTermsOfUse() {
        this._containers.termsOfUse.innerHTML = Localization.get('termsOfUse')
        this._containers.termsOfUse.dataset.lkey = 'termsOfUse'

        if (Localization.justifyText()) {
            this._containers.termsOfUse.classList.add('justify-text')
        } else {
            this._containers.termsOfUse.classList.remove('justify-text')
        }
    }

    updateAbout() {
        this._containers.about.innerHTML = Localization.get('about')
        this._containers.about.dataset.lkey = 'about'
        
        if (Localization.justifyText()) {
            this._containers.about.classList.add('justify-text')
        } else {
            this._containers.about.classList.remove('justify-text')
        }
    }

    onResetAnchorClicked(event) {
        event.preventDefault()
        // Load defaults

    }

    onDoneButtonClicked() {
        this._presenter.closeForm()
    }

    onKeyDown(event) {
        if (!this._wrapper.classList.contains('hidden')) {
            if (event.keyCode == 27) {
                this._presenter.closeForm()
            }
        } 
    }

    onNavButtonClicked(event) {
        let element = event.srcElement
        let target = element.dataset.navtarget
        let localizationTarget = `title${target.replace(CapitalizeFirstCharRegex, (c) => c.toUpperCase())}`

        this.setContentPanel(target)
        this.setCurrentNavButton(target)

        this._title.innerHTML = Localization.get(localizationTarget)
        this._title.dataset.lkey = localizationTarget
    }

    onSettingChanged(event) {
        let element = event.srcElement
        let elementType = element.nodeName
        let inputType = element.type

        let value 
        if (elementType === 'SELECT' || (elementType === 'INPUT' && inputType === 'range')) {
            value = element.value
            if (!isNaN(value)) {
                value = +value
            }

        } else if (elementType === 'INPUT' && inputType === 'checkbox') {
            value = element.checked
        }

        this._presenter.settingChanged(element.dataset.setting, value)
    }
}

module.exports = OptionsView