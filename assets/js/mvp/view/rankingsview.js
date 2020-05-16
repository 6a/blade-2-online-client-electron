const BaseView = require('./baseview.js')
const RankingsPresenter = require('../presenter/rankingspresenter.js')
const RankingsRow = require('../utility/containers').RankingsRow

const LOAD_TIMEOUT = 5

class RankingsView extends BaseView {
    constructor (viewsList) {
        super('rankings', RankingsPresenter, viewsList, 'hidden')
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
        this._wrapper = document.getElementById('rankings')

        this._loadingOverlay = document.getElementById('rankings-loading-overlay')
        this._loadingSpinner = document.getElementById('rankings-spinner')
        this._loadingErrorControls = document.getElementById('rankings-error-controls')
        this._rankingsContainer = document.getElementById('rankings-list-wrapper')

        this._playerRow = {
            wrapper: document.getElementById('rankings-player-row'),
            rank: document.getElementById('rankings-player-rank'),
            elo: document.getElementById('rankings-player-elo'),
            handle: document.getElementById('rankings-player-handle'),
            victories: document.getElementById('rankings-player-victories'),
            draws: document.getElementById('rankings-player-draws'),
            defeats: document.getElementById('rankings-player-defeats'),
            total: document.getElementById('rankings-player-total'),
            ratio: document.getElementById('rankings-player-ratio'),
        }

        this._returnButton = document.getElementById('rankings-return-button')
        this._retryButton = document.getElementById('rankings-retry-button')
    }

    addEventListeners() {
        this._returnButton.addEventListener('click', this.onReturnClicked.bind(this), false)
        this._retryButton.addEventListener('click', this.onRetryButtonClicked.bind(this), false)

        document.addEventListener('keydown', this.onEscDown.bind(this), false)
    }

    removeEventListeners() {
        this._returnButton.removeEventListener('click', this.onReturnClicked.bind(this), false)
        this._retryButton.removeEventListener('click', this.onRetryButtonClicked.bind(this), false)

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

    onRetryButtonClicked(event) {
        if (event) event.preventDefault()

        this._loadingOverlay.classList.remove('hidden')
        this._loadingSpinner.classList.remove('hidden')
        this._loadingErrorControls.classList.add('hidden')

        this._presenter.requestRankings()

        this._profileLoadTimeoutHandle = setTimeout(() => {
            this.handleTimeOut()
        }, LOAD_TIMEOUT);
    }

    setActive(active) {
        if (active) {
            this.clear()
            this.onRetryButtonClicked()
        }

        super.setActive(active)
    }

    updateRankings(rankingData) {
        console.log(rankingData)

        let rowStrings = []

        this._loadingSpinner.classList.add('hidden')
        this._loadingOverlay.classList.add('hidden')
        this._loadingErrorControls.classList.add('hidden')

        if (rankingData.rankings !== null) {
            let includesUserInfo = rankingData.user !== null
            let userHandle = includesUserInfo ? rankingData.user.handle : ''

            if (includesUserInfo) {
                this._playerRow.rank.innerHTML = userHandle
                this._playerRow.elo.innerHTML = rankingData.user.mmr
                this._playerRow.handle.innerHTML = rankingData.user.handle
                this._playerRow.victories.innerHTML = rankingData.user.wins
                this._playerRow.draws.innerHTML = rankingData.user.draws
                this._playerRow.defeats.innerHTML = rankingData.user.losses
                this._playerRow.total.innerHTML = rankingData.user.total
                this._playerRow.ratio.innerHTML = rankingData.user.winratio

                this._playerRow.wrapper.classList.remove('noDisplay')
            } else {
                this._playerRow.wrapper.classList.add('noDisplay')
            }

            rankingData.rankings.forEach(function(row) {
                let rankingsRow = new RankingsRow(row, userHandle)
                rowStrings.push(rankingsRow.getText())
            }.bind(this))

            this._rankingsContainer.innerHTML = rowStrings.join('')
        } else {
            this._loadingOverlay.classList.remove('hidden')
            this._loadingErrorControls.classList.remove('hidden')
        }
    }

    clear() {
        if (this._loadTimeout) {
            clearTimeout(this._loadTimeout)
        }
        
        this._loadTimeout = null

        this._rankingsContainer.innerHTML = '　'
        this._playerRow.rank.innerHTML = '　'
        this._playerRow.elo.innerHTML = '　'
        this._playerRow.handle.innerHTML = '　'
        this._playerRow.victories.innerHTML = '　'
        this._playerRow.draws.innerHTML = '　'
        this._playerRow.defeats.innerHTML = '　'
        this._playerRow.total.innerHTML = '　'
        this._playerRow.ratio.innerHTML = '　'
    }

    handleTimeOut() {
        
    }
}

module.exports = RankingsView