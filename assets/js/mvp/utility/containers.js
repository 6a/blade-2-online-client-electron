const Localization = require('../../utility/localization')

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

class Options {
    constructor(general, screen, sound) {
        this._general = general
        this._screen = screen
        this._sound = sound
    }

    get general() { return this._general }
    get screen() { return this._screen }
    get sound() { return this._sound }
}

class MessageConfig {
    constructor({titleLKey = 'confirmation', questionLKey = '', infoLKey = '', positiveButtonTextLKey = 'yes',
    positiveButtonCallback = undefined, negativeButtonTextLKey = 'cancel', negativeButtonCallback = undefined}) {
        if (positiveButtonCallback === undefined) {
            console.error('PositiveCallBack is undefined')
        }

        this._titleLKey = titleLKey
        this._questionLKey = questionLKey
        this._infoLKey = infoLKey
        this._positiveButtonTextLKey = positiveButtonTextLKey
        this._positiveButtonCallback = positiveButtonCallback
        this._negativeButtonTextLKey = negativeButtonTextLKey
        this._negativeButtonCallback = negativeButtonCallback
    }

    get titleLKey() { return this._titleLKey }
    get questionLKey() { return this._questionLKey }
    get infoLKey() { return this._infoLKey }
    get positiveButtonTextLKey() { return this._positiveButtonTextLKey }
    get positiveButtonCallback() { return this._positiveButtonCallback }
    get negativeButtonTextLKey() { return this._negativeButtonTextLKey }
    get negativeButtonCallback() { return this._negativeButtonCallback }
}

class MatchHistoryRow {

    /**
     * Construct a match history row, and store it as a string to be added to the DOM later
     * @param {Object} matchHistoryRowData The data to add to the row
     * @param {String} playerPublicID The public ID of the logged in player
     */
    constructor(matchHistoryRowData, playerPublicID) {
        let resultText = ''
        let resultLKey = ''
        if (matchHistoryRowData.winnerpid === '')
        {
            resultLKey = 'draw'
        } else if (matchHistoryRowData.winnerpid === playerPublicID) {
            resultLKey = 'victory'
        } else {
            resultLKey = 'defeat'
        }

        resultText = Localization.get(resultLKey)

        let opponentHandle = matchHistoryRowData.player1pid === playerPublicID ? matchHistoryRowData.player2handle : matchHistoryRowData.player1handle

        this._divText = `
        <div class="match-history-row">
            <span>${matchHistoryRowData.matchid}</span>
            <span>${this.formatDateTime(matchHistoryRowData.endtime)}</span>
            <span class="match-history-handle-hl">${opponentHandle}</span>
            <span data-lkey="${resultLKey}">${resultText}</span>
        </div>`
    }

    getText() {
        return this._divText
    }
}

class RankingsRow {

    /**
     * Construct a rankings row, and store it as a string to be added to the DOM later
     * @param {Object} rankingsData The leaderboards data to add to the row
     * @param {String} playerHandle The handle of the logged in player
     */
    constructor(rankingsData, playerHandle) {

        let decoratorClass = rankingsData.handle === playerHandle ? ' rankings-player-row-deco' : ''

        this._divText = `
        <div class="rankings-row${decoratorClass}">
            <span>${rankingsData.rank}</span>
            <span>${rankingsData.mmr}</span>
            <span>${rankingsData.handle}</span>
            <span>${rankingsData.wins}</span>
            <span>${rankingsData.draws}</span>
            <span>${rankingsData.losses}</span>
            <span>${rankingsData.total}</span>
            <span>${rankingsData.winratio.toFixed(2)}</span>
        </div>`
    }

    getText() {
        return this._divText
    }
}

module.exports = {
    PasswordWarningState,
    Options,
    MessageConfig,
    MatchHistoryRow,
    RankingsRow,
}