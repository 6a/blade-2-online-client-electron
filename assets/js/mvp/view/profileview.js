const BaseView = require('./baseview.js')
const ProfilePresenter = require('../presenter/profilepresenter.js')
const MatchHistoryRow = require('../utility/containers').MatchHistoryRow

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
    }

    addEventListeners() {
        this._returnButton.addEventListener('click', this.onReturnClicked.bind(this), false)

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

    setActive(active) {
        if (active) {
            this._loadingOverlay.classList.remove('hidden')
            this._loadingSpinner.classList.remove('hidden')
            this._loadingErrorControls.classList.add('hidden')
            this._presenter.requestMatchHistory()
        } else {
            this._loadingOverlay.classList.add('hidden')
            this._loadingSpinner.classList.add('hidden')
            this._loadingErrorControls.classList.add('hidden')
        }

        super.setActive(active)
    }

    updateMatchHistory(publicID, history) {
        this._loadingOverlay.classList.add('hidden')
        this._loadingSpinner.classList.add('hidden')
        this._loadingErrorControls.classList.add('hidden')

        if (history !== null) {
            let rowStrings = []

            history.forEach(function(row) {
                let matchHistoryRow = new MatchHistoryRow(row, publicID)
                rowStrings.push(matchHistoryRow.getText())
            })

            let matchHistoryString = rowStrings.join('')
            this._matchHistoryContainer.innerHTML = matchHistoryString
        } else {

        }
    }
}

module.exports = ProfileView