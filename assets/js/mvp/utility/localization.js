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
        // TODO later this should be loaded from a config file
        
        this._localizations = new Map()
        
        var inData = []
        inData.push(new Pair('usernameTooShort', {
            "jp": "ユーザー名は２文字以上でなければなりません",
            "en": "Username must be at at least 2 characters long"
        }))

        inData.push(new Pair('usernameIllegalChars', {
            "jp": "ユーザー名は英数字またはスペースでなければなりません",
            "en": "Username can only contain alphanumerical characters or spaces"
        }))

        inData.push(new Pair('passwordTooShort', {
            "jp": "パスワードは８文字以上でなければなりません",
            "en": "Password must be at at least 8 characters long"
        }))

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
}

module.exports = new Localization(['en', 'jp'], 'jp')