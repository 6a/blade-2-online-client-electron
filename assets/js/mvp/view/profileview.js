const BaseView = require('./baseview.js')
const ProfilePresenter = require('../presenter/profilepresenter.js')
const MatchHistoryRow = require('../utility/containers').MatchHistoryRow
const Localization = require('../../utility/localization')

const AVATAR_IMAGES = [
    'portrait-laura',
    'portrait-alisa',
    'portrait-elliot',
    'portrait-emma',
    'portrait-fie',
    'portrait-gaius',
    'portrait-jusis',
    'portrait-machius',
    'portrait-millium',
    'portrait-rean',
]

class AvatarChangeDirection{}
AvatarChangeDirection.LEFT = -1
AvatarChangeDirection.RIGHT = 1

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

        this._avatarIndex = 0

        this.resetUserDetails()
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

        this._avatar = document.getElementById('profile-avatar-image')
        this._elo = document.getElementById('profile-elo-rating')
        this._stats = {
            victories: document.getElementById('profile-match-stats-victories'),
            draws: document.getElementById('profile-match-stats-draws'),
            defeats: document.getElementById('profile-match-stats-defeats'),
            total: document.getElementById('profile-match-stats-total'),
            winratio: document.getElementById('profile-match-stats-winratio')
        }

        this._returnButton = document.getElementById('profile-return-button')
        this._retryButton = document.getElementById('profile-retry-button')
        this._avatarButtonLeft = document.getElementById('profile-avatar-button-left')
        this._avatarButtonRight = document.getElementById('profile-avatar-button-right')
    }

    addEventListeners() {
        this._returnButton.addEventListener('click', this.onReturnClicked.bind(this), false)
        this._retryButton.addEventListener('click', this.onRetryButtonClicked.bind(this), false)
        this._avatarButtonLeft.addEventListener('click', this.onAvatarSelectLeft.bind(this), false)
        this._avatarButtonRight.addEventListener('click', this.onAvatarSelectRight.bind(this), false)

        document.addEventListener('keydown', this.onEscDown.bind(this), false)
    }

    removeEventListeners() {
        this._returnButton.removeEventListener('click', this.onReturnClicked.bind(this), false)
        this._retryButton.removeEventListener('click', this.onRetryButtonClicked.bind(this), false)
        this._avatarButtonLeft.removeEventListener('click', this.onAvatarSelectLeft.bind(this), false)
        this._avatarButtonRight.removeEventListener('click', this.onAvatarSelectRight.bind(this), false)


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
        event.preventDefault()
        this._loadingOverlay.classList.remove('hidden')
        this._loadingSpinner.classList.remove('hidden')
        this._loadingErrorControls.classList.add('hidden')
        this._presenter.requestMatchHistory()
    }

    onAvatarSelectLeft(event) {
        event.preventDefault()

        this.changeAvatarImage(AvatarChangeDirection.LEFT)
    }

    
    onAvatarSelectRight(event) {
        event.preventDefault()

        this.changeAvatarImage(AvatarChangeDirection.RIGHT)
    }

    setActive(active) {
        if (active) {
            this.onRetryButtonClicked()
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

    resetUserDetails() {
        this._currentMatchHistory = null
        this._currentPublicID = null
        this._currentProfile = null

        this._elo.innerHTML = ''

        for (let index = 0; index < this._stats.length; index++) {
            this._stats[index].innerHTML = ''
            
        }
    }

    /**
     * Change the current avatar image, as well as the internal index, in the specified direction
     * @param {AvatarChangeDirection} direction The direction to iterate over the avatar collection
     */
    changeAvatarImage(direction) {
        if (direction === AvatarChangeDirection.LEFT || direction === AvatarChangeDirection.RIGHT) {
            this._avatarIndex = this._avatarIndex + direction

            if (this._avatarIndex < 0) {
                this._avatarIndex = AVATAR_IMAGES.length -1
            } else if (this._avatarIndex >= AVATAR_IMAGES.length) {
                this._avatarIndex = 0
            }

            let newAvatarString = AVATAR_IMAGES[this._avatarIndex]

            this._avatar.src = `../assets/images/character-portraits/${newAvatarString}.png`
        } 
    }
}

module.exports = ProfileView