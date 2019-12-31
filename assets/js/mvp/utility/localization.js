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
        
        let inData = []
        inData.push(new Pair('usernameTooShort', {
            "jp": "ユーザー名は２文字以上でなければなりません。",
            "en": "Username must be at at least 2 characters long."
        }))

        inData.push(new Pair('usernameCantStartWithSpace', {
            "jp": "ユーザー名の先頭に空白文字を使用できません。",
            "en": "Username cannot start with a space."
        }))

        inData.push(new Pair('usernameIllegalChars', {
            "jp": "ユーザー名には、全ての全角文字及び、全ての半角英数字と、ある特定の記号しか使用できません。",
            "en": "Usernames can only contain full-width japanese characters, half-width alphanumerical characters and certain symbols."
        }))

        inData.push(new Pair('usernameAlreadyInUse', {
            "jp": "指定されたユーザー名は既に使用されています。",
            "en": "The specified username is already in use."
        }))

        inData.push(new Pair('usernameRude', {
            "jp": "ユーザー名に暴言を含まないように指定してください。",
            "en": "Usernames can not contain profanity."
        }))


        inData.push(new Pair('emailInvalid', {
            "jp": "有効なメールアドレスを指定してください。",
            "en": "Please provide a valid email address."
        }))

        inData.push(new Pair('emailAlreadyInUse', {
            "jp": "指定されたメールアドレスは既に使用されています。",
            "en": "The specified email address is already in use."
        }))

        inData.push(new Pair('passwordEmpty', {
            "jp": "パスワードを指定してください。",
            "en": "Please enter your password."
        }))

        inData.push(new Pair('passwordTooShort', {
            "jp": "パスワードは８文字以上でなければなりません。",
            "en": "Password must be at at least 8 characters long."
        }))

        inData.push(new Pair('invalidCredentials', {
            "jp": "ユーザー名又はパスワードが無効です。",
            "en": "Username or password is incorrect."
        }))

        inData.push(new Pair('serverGenericError', {
            "jp": "予期しないエラーが発生しました。しばらくしてからもう一度試してください。",
            "en": "An unexpected error occurred. Please try again later."
        }))

        inData.push(new Pair('serverConnectionError', {
            "jp": "サーバーと接続できませんでした。プロクシー又はネットワーク問題による妨害が発生している可能性があります。",
            "en": "Could not connect to the server. A proxy configuration, or some sort of network problem may be blocking the connection."
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