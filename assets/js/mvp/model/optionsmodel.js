const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event
const fs = require('fs')

const licensePath = 'assets/docs/third-party-licenses'

class OptionsModel extends BaseModel {
    constructor () {
        super('options')
        this.init()
        this._active = false
    }

    init() {
        super.init()

        this.onLicenseInfoReady = new B2Event('License Info Ready')

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
            } else {
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
            }
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