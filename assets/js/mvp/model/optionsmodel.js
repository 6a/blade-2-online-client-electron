const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const fs = require('fs')
const Localization = require('../utility').Localization

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

        this.onLicenseInfoReady = new B2Event('License Info Ready')
        this.onTermsOfUseReady = new B2Event('Terms of Use Ready')
        this.onAboutReady = new B2Event('About Ready')

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

    loadPair(en, jp, localizationKey, onDone) {
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
                        Localization.add(localizationKey, contentStrings.jp, contentStrings.en)
                        onDone.broadcast()
                    }
                }
            })
        })
    }

    loadTermsOfUse() {
        this.loadPair(TERMSOFUSE_EN, TERMSOFUSE_JP, 'termsOfUse', this.onTermsOfUseReady)
    }

    loadAbout() {
        this.loadPair(ABOUT_EN, ABOUT_JP, 'about', this.onAboutReady)
    }

    onOptionsClicked() {
        if (!this._active) {
            this.models.peekCurrentObject().setLocked(true)
            this.show()
        }
    }
}

module.exports = OptionsModel