const BaseModel = require('./basemodel.js')
const { B2Event, Localization, Containers } = require('../utility')
const Settings = require('../../utility/settings')
const fs = require('fs')
const MarkdownIt = require('markdown-it')

const LICENSE_PATH = 'assets/docs/third-party-licenses'
const TERMSOFUSE_EN = 'assets/docs/terms-of-use/tou-en.md'
const TERMSOFUSE_JP = 'assets/docs/terms-of-use/tou-jp.md'
const ABOUT_EN = 'assets/docs/about/about-en.md'
const ABOUT_JP = 'assets/docs/about/about-jp.md'

class OptionsModel extends BaseModel {
    constructor () {
        super('options')
        this.init()
        this._active = false
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
    }

    destroy() {
        super.destroy()
    }

    closeForm() {
        this.models.get(this.models.popToPrevious(this.name)).show()
        this.hide()
    }

    loadSettings() {
        let general = {
            locale: Settings.get(Settings.KEY_LOCALE),
            masterVolume: Settings.get(Settings.KEY_MASTER_VOLUME),
            disableBackgroundVideos: Settings.get(Settings.KEY_DISABLE_BACKGROUND_VIDEOS),
        }

        let screen = {

        }

        let sound = {

        }

        var opts = new Containers.Options(general, screen, sound)
        this.onSettingsReady.broadcast(opts)
    }

    loadLicenses() {
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
        this.loadLocalizedPair(TERMSOFUSE_EN, TERMSOFUSE_JP, 'termsOfUse', (pair) => {
            let md = new MarkdownIt()
            Object.keys(pair).forEach((key) => {
                pair[key] = md.render(pair[key])
            })

            Localization.add('termsOfUse', pair.jp, pair.en)
            this.onTermsOfUseReady.broadcast()
        })
    }

    loadAbout() {
        this.loadLocalizedPair(ABOUT_EN, ABOUT_JP, 'about', (pair) => {
            let md = new MarkdownIt({ linkify: true })
            Object.keys(pair).forEach((key) => {
                pair[key] = md.render(pair[key])
            })

            Localization.add('about', pair.jp, pair.en)
            this.onAboutReady.broadcast()
        })
    }

    settingChanged(setting, newValue) {
        Settings.set(setting, newValue)
        this.onSettingChanged.broadcast({
            setting: setting,
            newValue: newValue
        })
    }

    onOptionsClicked() {
        if (!this._active) {
            this.models.peekCurrentObject().setLocked(true)
            this.show()
        }
    }
}

module.exports = OptionsModel