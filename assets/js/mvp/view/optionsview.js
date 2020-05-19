const BaseView = require('./baseview.js')
const OptionsPresenter = require('../presenter/optionspresenter.js')
const MarkdownIt = require('markdown-it')
const sound = require('../../utility/sound')

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

        this.toggleTabbables(false)
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
        this._screen = {
            resolution: document.getElementById('options-screen-resolution'),
            screenMode: document.getElementById('options-screen-screen-mode'),
            disableVSync: document.getElementById('options-screen-disable-vsync'),
            antiAliasing: document.getElementById('options-screen-anti-aliasing'),
            shadowQuality: document.getElementById('options-screen-shadow-quality'),
            postProcessing: document.getElementById('options-screen-post-processing'),
        }
        this._sound = {
            masterVolume: document.getElementById('options-sound-master-volume'),
            backgroundMusicVolume: document.getElementById('options-sound-background-music-volume'),
            soundEffectsVolume: document.getElementById('options-sound-sound-effects-volume'),
        }
    }

    addEventListeners() {
        this._doneButton.addEventListener('click', this.onDoneButtonClicked.bind(this), false)
        this._resetAnchor.addEventListener('click', this.onResetAnchorClicked.bind(this), false)

        Object.values(this._nav).forEach((element) => {
            element.addEventListener('click', this.onNavButtonClicked.bind(this), false)
        })   

        Object.values(this._general).forEach((element) => {
            element.addEventListener('input', this.onSettingChanged.bind(this), false)
        })

        Object.values(this._screen).forEach((element) => {
            element.addEventListener('input', this.onSettingChanged.bind(this), false)
        })    

        Object.values(this._sound).forEach((element) => {
            element.addEventListener('input', this.onSettingChanged.bind(this), false)
        })    

        // Slider edge cases - they need to have a callback for the mouse up event so that we can add a sound,
        // rather than playing a sound in change which can get really spammy.
        this._general.masterVolume.addEventListener('mouseup', this.onSliderMouseUp.bind(this), false)
        this._sound.masterVolume.addEventListener('mouseup', this.onSliderMouseUp.bind(this), false)
        this._sound.backgroundMusicVolume.addEventListener('mouseup', this.onSliderMouseUp.bind(this), false)
        this._sound.soundEffectsVolume.addEventListener('mouseup', this.onSliderMouseUp.bind(this), false)
        
        document.addEventListener('keydown', this.onEscDown.bind(this), false)
    }

    removeEventListeners() {
        this._doneButton.removeEventListener('click', this.onDoneButtonClicked.bind(this), false)
        this._resetAnchor.removeEventListener('click', this.onResetAnchorClicked.bind(this), false)

        Object.values(this._nav).forEach((element) => {
            element.removeEventListener('click', this.onNavButtonClicked.bind(this), false)
        })   

        Object.values(this._general).forEach((element) => {
            element.removeEventListener('input', this.onSettingChanged.bind(this), false)
        })       
        
        Object.values(this._screen).forEach((element) => {
            element.removeEventListener('input', this.onSettingChanged.bind(this), false)
        })    

        Object.values(this._sound).forEach((element) => {
            element.removeEventListener('input', this.onSettingChanged.bind(this), false)
        })    

        this._general.masterVolume.removeEventListener('mouseup', this.onSliderMouseUp.bind(this), false)
        this._sound.masterVolume.removeEventListener('mouseup', this.onSliderMouseUp.bind(this), false)
        this._sound.backgroundMusicVolume.removeEventListener('mouseup', this.onSliderMouseUp.bind(this), false)
        this._sound.soundEffectsVolume.removeEventListener('mouseup', this.onSliderMouseUp.bind(this), false)

        document.removeEventListener('keydown', this.onEscDown.bind(this), false)
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
        if (settings.general !== null) {
            this._general.language.value = settings.general.locale
            this._general.masterVolume.value = settings.general.masterVolume
            this._general.disableBackgroundVideos.checked = settings.general.disableBackgroundVideos
        }

        // Screen
        if (settings.screen !== null) {
            this._screen.resolution.value = settings.screen.resolution
            this._screen.screenMode.value = settings.screen.screenMode
            this._screen.disableVSync.checked = settings.screen.disableVSync
            this._screen.antiAliasing.value = settings.screen.antiAliasing
            this._screen.shadowQuality.value = settings.screen.shadowQuality
            this._screen.postProcessing.value = settings.screen.postProcessing
        }

        // Sound
        if (settings.sound !== null) {
            this._sound.masterVolume.value = settings.sound.masterVolume
            this._sound.backgroundMusicVolume.value = settings.sound.backgroundMusicVolume
            this._sound.soundEffectsVolume.value = settings.sound.soundEffectsVolume
        }
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
        this.setLocalizedInnerHTML(this._containers.termsOfUse, 'termsOfUse')
    }

    updateAbout() {
        this.setLocalizedInnerHTML(this._containers.about, 'about')
    }

    resetMessageCallback() {
        this._presenter.requestSettingsReset()
    }

    onResetAnchorClicked(event) {
        event.preventDefault()

        this._presenter.showResetMessage(this.resetMessageCallback.bind(this))

        sound.play(sound.SELECT)
    }

    onDoneButtonClicked() {
        this._presenter.closeForm()

        sound.play(sound.CLOSE)
    }

    onNavButtonClicked(event) {
        let element = event.srcElement
        let target = element.dataset.navtarget
        let lKey = `title${target.replace(CapitalizeFirstCharRegex, (c) => c.toUpperCase())}`

        this.setContentPanel(target)
        this.setCurrentNavButton(target)

        this.setLocalizedInnerHTML(this._title, lKey)

        sound.play(sound.SELECT)
    }

    onSettingChanged(event) {
        let element = event.srcElement
        let id = event.srcElement.id
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
        
        // Edge cases for elements that appear more than once (so changing it means it needs to be immediately updated)
        // somewhere else on this view
        if (id === 'options-general-master-volume') {
            let val = this._general.masterVolume.value
            this._sound.masterVolume.value = val
        } else if (id === 'options-sound-master-volume') {
            let val = this._sound.masterVolume.value
            this._general.masterVolume.value = val
        }

        if (elementType !== 'INPUT' || inputType !== 'range') sound.play(sound.SELECT)
    }

    onSliderMouseUp(event) {
        sound.play(sound.SELECT)
    }
}

module.exports = OptionsView