const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const fs = require('fs')
const Localization = require('../utility').Localization

const licensePath = 'assets/docs/third-party-licenses'
const termsOfUseEN = 'assets/docs/terms-of-use/tou-en.md'
const termsOfUseJP = 'assets/docs/terms-of-use/tou-jp.md'

class OptionsModel extends BaseModel {
    constructor () {
        super('options')
        this.init()
        this._active = false
        this._termsOfUse = {
            en: "",
            jp: ""
        }
    }

    init() {
        super.init()

        this.onLicenseInfoReady = new B2Event('License Info Ready')
        this.onTermsOfUseReady = new B2Event('Terms of Use Ready')

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

    requestLicenses() {
        fs.readdir(licensePath, (err, fileNames) => {
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
                fs.readFile(`${licensePath}/${filename}`, (err, content) => {
                    if (err) {
                        console.err(`[Options] failed to read file [${licensePath}/${filename}]:\n${err}`) 
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

    requestTermsOfUse() {
        let files = {
            en: termsOfUseEN,
            jp: termsOfUseJP
        }

        Object.keys(files).forEach((key) => {
            fs.readFile(files[key], (err, content) => {
                if (err) {
                    console.err(`[Options] failed to read terms of use [${files[key]}]:\n${err}`)
                } else {
                    let markdown = content.toString()
                    this._termsOfUse[key] = markdown
                    if (this._termsOfUse.en !== '' && this._termsOfUse.jp !== '') {
                        this.onTermsOfUseReady.broadcast(this._termsOfUse[Localization.getLocale()])
                    }
                }
            })
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