const fs = require('fs');
const yaml = require('js-yaml')
const Settings = require('./settings')
const Timer = require('./timer')
const makepath = require('./makepath')

const LOCALIZATIONS = makepath('assets/docs/localizations/localizations.yaml')
const DEFAULT_ENCODING = 'utf8'

class Pair {
    constructor(key, data) {
        this._key = key
        this._data = data
        this._localizationTargets = undefined
    }

    get key() {
        return this._key
    }

    
    get data() {
        return this._data
    }
}

class Localization {
    constructor(locales) {
        this._locales = locales
    }

    init () {
        this.load()
        this.setLocale(Settings.get(Settings.KEYS.LOCALE))
    }

    load() {
        let timer = new Timer()

        this._localizations = new Map()
        let inData = []

        try {
            let fileContents = fs.readFileSync(LOCALIZATIONS, DEFAULT_ENCODING);
            let data = yaml.safeLoad(fileContents);
    
            if (typeof(data) === 'string') 
            {
                throw new Error('Localizations file appears to be incorrectly formatted')
            } else {
                Object.keys(data).forEach((key) => {
                    inData.push(new Pair(key, data[key]))
                })
            }
        } catch (e) {
            console.error(`Could not load localization data:\n${e}`)
        }

        inData.forEach(pair => {
            this._localizations.set(pair.key, pair.data)
        });

        timer.printElapsed('Localization data')
    }

    setLocale(locale) {
        if (this._locales.includes(locale)) {
            this._currentLocale = locale
            
            if (!this._localizationTargets) this._localizationTargets = document.querySelectorAll('[data-lkey]')
             
            this._localizationTargets.forEach((element) => {
                let key = element.dataset.lkey
                let justify = element.dataset.justify
                let type = element.nodeName

                if (key !== '') {
                    if (['H1', 'H2', 'H3', 'H4', 'H5', 'LABEL', 'DIV', 'P', 'BUTTON', 'A', 'SECTION', 'LI', 'OPTION', 'SPAN'].includes(type)) {
                        element.innerHTML = this.get(key)
                    } else if (['INPUT'].includes(type)) {
                        element.placeholder = this.get(key)
                    } 
                    
                    if (justify === "true") {
                        if (this.justifyText()) {
                            element.classList.add('justify-text')
                        } else {
                            element.classList.remove('justify-text')
                        }
                    }
                }
            })

        } else {
            console.error(`Cannot swap to locale [ ${locale} ] as it has not been configured`)
        }
    }

    get(key) {
        if (this._localizations.has(key)) {
            return this._localizations.get(key)[this._currentLocale]
        } else {
            console.error(`No localization exists for key [ ${key} ]`)
        }
    }

    add(key, dataJP, dataEN) {
        this._localizations.set(key, {
            jp: dataJP,
            en: dataEN
        })
    }

    getLocale() {
        return this._currentLocale
    }

    justifyText() {
        return ['ja-JP'].includes(this._currentLocale)
    }
}

module.exports = new Localization(['en', 'ja-JP'])