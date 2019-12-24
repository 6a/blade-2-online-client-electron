class PasswordWarningState {
    constructor() {
        this._ascii = PasswordWarningState.INACTIVE
        this._fifteenChars = PasswordWarningState.INACTIVE
        this._eightChars = PasswordWarningState.INACTIVE
        this._oneNumeral = PasswordWarningState.INACTIVE
        this._oneLowerCase = PasswordWarningState.INACTIVE
    }

    get ascii() { return this._ascii }
    set ascii(state) { this._ascii = state }

    get fifteenChars() { return this._fifteenChars }
    set fifteenChars(state) { this._fifteenChars = state }

    get eightChars() { return this._eightChars }
    set eightChars(state) { this._eightChars = state }

    get oneNumeral() { return this._oneNumeral }
    set oneNumeral(state) { this._oneNumeral = state }

    get oneLowerCase() { return this._oneLowerCase }
    set oneLowerCase(state) { this._oneLowerCase = state }

    get hasWarnings() {
        let hasWarning = (
            this._ascii === PasswordWarningState.FAIL || 
            this._fifteenChars === PasswordWarningState.FAIL || 
            this._eightChars === PasswordWarningState.FAIL || 
            this._oneNumeral === PasswordWarningState.FAIL || 
            this._oneLowerCase === PasswordWarningState.FAIL
        )

        return hasWarning
    }
}

PasswordWarningState.INACTIVE = 'inactive'
PasswordWarningState.PASS = 'pass'
PasswordWarningState.FAIL = 'fail'

module.exports = {
    PasswordWarningState
}