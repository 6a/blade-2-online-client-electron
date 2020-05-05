const BaseModel = require('./basemodel.js')
const { B2Event, Localization, containers } = require('../utility')
const Settings = require('../../utility/settings')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const Timer = require('../../utility/timer')

const LICENSE_PATH = 'assets/docs/third-party-licenses'
const TERMSOFUSE_EN = 'assets/docs/terms-of-use/tou-en.md'
const TERMSOFUSE_JP = 'assets/docs/terms-of-use/tou-jp.md'
const ABOUT_EN = 'assets/docs/about/about-en.md'
const ABOUT_JP = 'assets/docs/about/about-jp.md'

class OptionsModel extends BaseModel {
    constructor () {
        super('options')
        this.init()
    }

    init() {
        super.init()

        this.onSettingsReady = new B2Event('Settings Ready')
        this.onLicenseInfoReady = new B2Event('License Info Ready')
        this.onTermsOfUseReady = new B2Event('Terms of Use Ready')
        this.onAboutReady = new B2Event('About Ready')
        this.onSettingChanged = new B2Event('Setting Changed')

        // this.addEventListener(this.models.get('net').onCreateAccountResponse.register(this.processCreateAccountResponse.bind(this)))
        
        document.getElementById("opts-button").addEventListener("click", this.onOptionsClicked.bind(this), false);

        this._active = false
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).setLocked(false)
        this.hide()
    }

    loadSettings() {
        let general = {
            locale: Settings.get(Settings.KEYS.LOCALE),
            masterVolume: Settings.get(Settings.KEYS.MASTER_VOLUME),
            disableBackgroundVideos: Settings.get(Settings.KEYS.DISABLE_BACKGROUND_VIDEOS),
        }

        let screen = {
            resolution: Settings.get(Settings.KEYS.RESOLUTION),
            screenMode: Settings.get(Settings.KEYS.SCREEN_MODE),
            disableVSync: Settings.get(Settings.KEYS.DISABLE_VSYNC),
            antiAliasing: Settings.get(Settings.KEYS.ANTI_ALIASING),
            shadowQuality: Settings.get(Settings.KEYS.SHADOW_QUALITY),
            postProcessing: Settings.get(Settings.KEYS.POST_PROCESSING),
        }

        let sound = {
            masterVolume: Settings.get(Settings.KEYS.MASTER_VOLUME),
            backgroundMusicVolume: Settings.get(Settings.KEYS.BGM_VOLUME),
            soundEffectsVolume: Settings.get(Settings.KEYS.SFX_VOLUME),
        }

        let opts = new containers.Options(general, screen, sound)
        this.onSettingsReady.broadcast(opts)
    }

    loadLicenses() {
        let timer = new Timer()

        fs.readdir(LICENSE_PATH, (err, fileNames) => {
            let files = []
            let done = 0
            let expected = 0
            if (err) {
                console.error(`[Options] Could not read license files:\n${err}`)
                this.onLicenseInfoReady.broadcast(files)
                return
            } 

            expected = fileNames.length
            fileNames.forEach((filename) => {
                fs.readFile(`${LICENSE_PATH}/${filename}`, (err, content) => {
                    if (err) {
                        console.err(`[Options] failed to read file [${LICENSE_PATH}/${filename}]:\n${err}`) 
                        this.onLicenseInfoReady.broadcast(files)
                    } else {
                        files.push(content.toString())

                        if (++done === expected) {
                            files.sort((a, b) => {
                                return a.slice(0, 10).localeCompare(b.slice(0, 10), 'en', { 'sensitivity': 'base' })
                            })

                            this.onLicenseInfoReady.broadcast(files)

                            timer.printElapsed('License files')
                        }
                    }
                })
            })
        })
    }

    loadLocalizedPair(en, jp, localizationKey, callBack) {
        let files = {
            en: en,
            jp: jp
        }

        let contentStrings = {
            en: "",
            jp: ""
        }

        Object.keys(files).forEach((key) => {
            fs.readFile(files[key], (err, content) => {
                if (err) {
                    console.err(`[Options] failed to read ${localizationKey} file [${files[key]}]:\n${err}`)
                } else {
                    let markdown = content.toString()
                    contentStrings[key] = markdown
                    if (contentStrings.en !== '' && contentStrings.jp !== '') {
                        callBack(contentStrings)
                    }
                }
            })
        })
    }

    loadTermsOfUse() {
        let timer = new Timer()

        this.loadLocalizedPair(TERMSOFUSE_EN, TERMSOFUSE_JP, 'termsOfUse', (pair) => {
            let md = new MarkdownIt()
            Object.keys(pair).forEach((key) => {
                pair[key] = md.render(pair[key])
            })

            Localization.add('termsOfUse', pair.jp, pair.en)
            this.onTermsOfUseReady.broadcast()
            timer.printElapsed('Terms of Use files')
        })
    }

    loadAbout() {
        let timer = new Timer()

        this.loadLocalizedPair(ABOUT_EN, ABOUT_JP, 'about', (pair) => {
            let md = new MarkdownIt({ linkify: true })
            Object.keys(pair).forEach((key) => {
                pair[key] = md.render(pair[key])
            })

            Localization.add('about', pair.jp, pair.en)
            this.onAboutReady.broadcast()
            timer.printElapsed('About files')
        })
    }

    settingChanged(setting, newValue) {
        Settings.set(setting, newValue)
        this.onSettingChanged.broadcast({
            setting: setting,
            newValue: newValue
        })
    }

    showResetMessage(positiveCallback) {
        let opts = new containers.MessageConfig({
            titleLKey: 'confirmation',
            questionLKey: 'msgResetQuestion',
            infoLKey: 'msgResetInfo',
            positiveButtonTextLKey: 'yes',
            positiveButtonCallback: positiveCallback,
            negativeButtonTextLKey: 'cancel',

        })

        this.models.get('message').open(opts)
    }

    resetSettings() {
        // Settings.reset()
        // this.loadSettings()

        // let allSettings = Settings.getAll()
        // Object.keys(allSettings).forEach((key) => {
        //     this.onSettingChanged.broadcast({
        //         setting: key,
        //         newValue: allSettings[key]
        //     })
        // })
    }

    getLaunchConfigData() {
        return [
            Settings.get(Settings.KEYS.LOCALE),
            Settings.get(Settings.KEYS.RESOLUTION),
            Settings.screenModeStringToInt(Settings.get(Settings.KEYS.SCREEN_MODE)),
            Settings.get(Settings.KEYS.DISABLE_VSYNC) ? 0 : 1,
            Settings.get(Settings.KEYS.ANTI_ALIASING),
            Settings.get(Settings.KEYS.SHADOW_QUALITY),
            Settings.get(Settings.KEYS.POST_PROCESSING),
            Settings.get(Settings.KEYS.MASTER_VOLUME),
            Settings.get(Settings.KEYS.BGM_VOLUME),
            Settings.get(Settings.KEYS.SFX_VOLUME),
        ]
    }

    onOptionsClicked() {
        if (!this._active) {
            this.models.peekCurrentObject().setLocked(true)
            this.show()
        }
    }
}

module.exports = OptionsModel