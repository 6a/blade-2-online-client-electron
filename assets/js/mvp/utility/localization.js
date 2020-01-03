const fs = require('fs');
const yaml = require('js-yaml')

const LOCALIZATIONS = 'assets/docs/localizations/localizations.yaml'
const DEFAULT_ENCODING = 'utf8'

class Pair {
    constructor(key, data) {
        this._key = key
        this._data = data
    }

    get key() {
        return this._key
    }

    
    get data() {
        return this._data
    }
}

class Localization {
    constructor(locales, initialLocale) {
        this._locales = locales
        this._currentLocale = initialLocale
        this.load()
    }

    load() {
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
    }

    setLocale(locale) {
        if (locale in this._locales) {
            this._currentLocale = locale
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
        return ['jp'].includes(this._currentLocale)
    }
}

module.exports = new Localization(['en', 'jp'], 'jp')