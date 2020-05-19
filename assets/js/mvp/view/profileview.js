const BaseView = require('./baseview.js')
const { Models } = require('../utility')
const ProfilePresenter = require('../presenter/profilepresenter.js')
const MatchHistoryRow = require('../utility/containers').MatchHistoryRow
const Localization = require('../../utility/localization')
const sound = require('../../utility/sound')

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

const DATA_EXPECTED = 2

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

        this.onRetryButtonClicked()
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
        this.profileHandle = document.getElementById('profile-handle')
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

        this._presenter.requestAvatarUpdate(this._avatarIndex)
        this._presenter.closeForm()

        sound.play(sound.CLOSE)
    }

    onEscDown(event) {
        if (new Models().peekCurrentName() === this.name) {
            this._presenter.requestAvatarUpdate(this._avatarIndex)
        }

        super.onEscDown(event)
    }

    onRetryButtonClicked(event) {
        if (event) event.preventDefault()

        this._loadingOverlay.classList.remove('hidden')
        this._loadingSpinner.classList.remove('hidden')
        this._loadingErrorControls.classList.add('hidden')

        this._presenter.requestMatchHistory()
        this._presenter.requestProfile()

        if (event) sound.play(sound.SELECT)
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
            this.resetUserDetails()
            this.onRetryButtonClicked()
        }

        super.setActive(active)
    }

    updateMatchHistoryData(publicID, history) {
        this._currentMatchHistory = history
        this._currentPublicID = publicID

        if (++this._dataReceived >= DATA_EXPECTED) {
            this.applyAll()
        }
    }

    updateProfileData(handle, profile) {
        this._currentHandle = handle
        this._currentProfile = profile

        if (++this._dataReceived >= DATA_EXPECTED) {
            this.applyAll()
        }
    }

    applyAll() {
        this._loadingSpinner.classList.add('hidden')
        this._loadingOverlay.classList.add('hidden')
        this._loadingErrorControls.classList.add('hidden')

        if (this._currentMatchHistory !== null && this._currentProfile !== null) {
            this.applyMatchHistory()
            this.applyProfile()
            return
        }
        
        this._loadingOverlay.classList.remove('hidden')
        this._loadingErrorControls.classList.remove('hidden')
    }

    applyMatchHistory() {
        let matchHistoryString = ''

        let rowStrings = []

        if (this._currentMatchHistory.length > 0) {
            this._currentMatchHistory.forEach(function(row) {
                let matchHistoryRow = new MatchHistoryRow(row, this._currentPublicID)
                rowStrings.push(matchHistoryRow.getText())
            }.bind(this))
        } else {
            rowStrings.push(`<p data-lkey="noMatchesFound">${Localization.get('noMatchesFound')}</p>`)
        }

        matchHistoryString = rowStrings.join('')

        this._matchHistoryContainer.innerHTML = matchHistoryString
    }

    applyProfile() {
        this._avatarIndex = this._currentProfile.avatar
        if (this._avatarIndex < 0 || this._avatarIndex >= AVATAR_IMAGES.length) {
            this._avatarIndex = 0
        }

        this.updateAvatar()

        this.profileHandle.innerHTML = this._currentHandle

        this._elo.innerHTML = this._currentProfile.mmr

        this._stats.victories.innerHTML = this._currentProfile.wins
        this._stats.draws.innerHTML = this._currentProfile.draws
        this._stats.defeats.innerHTML = this._currentProfile.losses
        this._stats.total.innerHTML = this._currentProfile.rankedtotal
        this._stats.winratio.innerHTML = this._currentProfile.winratio.toFixed(2)
    }

    resetUserDetails() {
        this._currentMatchHistory = null
        this._currentPublicID = null
        this._currentProfile = null
        this._currentHandle = null
        this._dataReceived = 0

        this._elo.innerHTML = '　'
        this._stats.victories.innerHTML = '　'
        this._stats.draws.innerHTML = '　'
        this._stats.defeats.innerHTML = '　'
        this._stats.total.innerHTML = '　'
        this._stats.winratio.innerHTML = '　'
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

            this.updateAvatar()
        } 

        sound.play(sound.SELECT)
    }

    updateAvatar() {
        let newAvatarString = AVATAR_IMAGES[this._avatarIndex]
        this._avatar.src = `../assets/images/character-portraits/${newAvatarString}.png`
    }
}

module.exports = ProfileView