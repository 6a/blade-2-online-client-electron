const BaseView = require('./baseview.js')
const ProfilePresenter = require('../presenter/profilepresenter.js')
const MatchHistoryRow = require('../utility/containers').MatchHistoryRow
const Localization = require('../../utility/localization')

class ProfileView extends BaseView {
    constructor (viewsList) {
        super('profile', ProfilePresenter, viewsList, 'hidden')
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
        this.addTabbables()
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('profile')

        this._loadingOverlay = document.getElementById('profile-loading-overlay')
        this._loadingSpinner = document.getElementById('profile-spinner')
        this._loadingErrorControls = document.getElementById('profile-error-controls')
        this._matchHistoryContainer = document.getElementById('profile-match-history-list-wrapper')

        this._returnButton = document.getElementById('profile-return-button')
        this._retryButton = document.getElementById('profile-retry-button')
    }

    addEventListeners() {
        this._returnButton.addEventListener('click', this.onReturnClicked.bind(this), false)
        this._retryButton.addEventListener('click', this.initialiseProfileFetch.bind(this), false)

        document.addEventListener('keydown', this.onEscDown.bind(this), false)
    }

    removeEventListeners() {
        this._returnButton.removeEventListener('click', this.onReturnClicked.bind(this), false)

        document.removeEventListener('keydown', this.onEscDown.bind(this), false)
    }

    addTabbables() {
        let tabbables = [
            this._returnButton,
        ]

        super.addTabbables(tabbables)
    }

    onReturnClicked(event) {
        event.preventDefault()
        this._presenter.closeForm()
    }

    initialiseProfileFetch(event) {
        this._loadingOverlay.classList.remove('hidden')
        this._loadingSpinner.classList.remove('hidden')
        this._loadingErrorControls.classList.add('hidden')
        this._presenter.requestMatchHistory()
    }

    setActive(active) {
        if (active) {
            this.initialiseProfileFetch()
        }

        super.setActive(active)
    }

    updateMatchHistory(publicID, history) {
        this._loadingSpinner.classList.add('hidden')

        let matchHistoryString = ''

        console.log(`history: [ ${history} ]`)

        if (history !== null) {
            let rowStrings = []

            if (history.length > 0) {
                history.forEach(function(row) {
                    let matchHistoryRow = new MatchHistoryRow(row, `bqnf8ku4h65c72kc0330`)
                    rowStrings.push(matchHistoryRow.getText())
                })
            } else {
                rowStrings.push(`
                    <p data-lkey="noMatchesFound">${Localization.get('noMatchesFound')}</p>
                `)
            }

            matchHistoryString = rowStrings.join('')

            this._loadingOverlay.classList.add('hidden')
            this._loadingErrorControls.classList.add('hidden')
        } else {
            this._loadingOverlay.classList.remove('hidden')
            this._loadingErrorControls.classList.remove('hidden')
        }

        this._matchHistoryContainer.innerHTML = matchHistoryString
    }
}

module.exports = ProfileView