const BaseView = require('./baseview.js')
const LobbyPresenter = require('../presenter/lobbypresenter.js')
const { Localization } = require('../utility')

const DEFAULT_SELECTOR_OFFSET = 190
const NINENTY_DEGREES = 90
const QUEUE_TIMER_TICK = 1000 / 10

const LOBBY_BUTTON_TEXT_STATE = ['lobby-main-button-text-state-active', 'lobby-main-button-text-state-below', 'hidden', 'lobby-main-button-text-state-above']

const QUEUE_NOTIFICATION_HIDDEN_CLASS = 'lobby-queue-notification-hidden'

const QUEUE_NOTIFICATION_LKEY_CONNECTING = 'connectingToServer'
const QUEUE_NOTIFICATION_LKEY_SEARCHING = 'searchingForAGame'

class LobbyView extends BaseView {
    constructor(viewsList) {
        super('lobby', LobbyPresenter, viewsList, 'hidden')
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
        this.addTabbables()

        this.toggleTabbables(false)

        this._pageIndex = 0
        this._pageCount = 4
        this._animating = false

        this._queueTimer
        this._queueTimerStartTime
        this._queueTimerRunning = false
        this._queueTimerOffset = 0
        this._queueTimeAtLastTick = 0
        this._queueIntervalHandle

        this._readyCheckBackgroundVideoDisabled = false
        this._readyCheckInProgress = false
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('lobby')

        this._queueNotification = document.getElementById('lobby-queue-notification')
        this._queueNotificationTimerText = document.getElementById('lobby-queue-notification-small-timer')
        this._queueNotificationText = document.getElementById('lobby-queue-notification-small-message')

        this._readyCheckBackgroundVideo = document.getElementById('ready-check-bg-video')
        this._readyCheckBackgroundVideoPoster = document.getElementById('ready-check-video-poster')

        this._buttons = {
            mainButton: document.getElementById('lobby-main-button'),
            upButton: document.getElementById('lobby-nav-up-button'),
            downButton: document.getElementById('lobby-nav-down-button'),
        }

        this._mainButtonText = {
            home: document.getElementById('lobby-selector-label-text-home'),
            play: document.getElementById('lobby-selector-label-text-play'),
            profile: document.getElementById('lobby-selector-label-text-profile'),
            rankings: document.getElementById('lobby-selector-label-text-rankings')
        }

        this._selectors = {
            home: document.getElementById('lobby-selector-item-home'),
            play: document.getElementById('lobby-selector-item-play'),
            profile: document.getElementById('lobby-selector-item-profile'),
            rankings: document.getElementById('lobby-selector-item-rankings')
        }

        this._selectorText = {
            home: document.getElementById('lobby-selector-item-text-home'),
            play: document.getElementById('lobby-selector-item-text-play'),
            profile: document.getElementById('lobby-selector-item-text-profile'),
            rankings: document.getElementById('lobby-selector-item-text-rankings')
        }

        this._backgrounds = {
            home: document.getElementById('lobby-background-image-home'),
            play: document.getElementById('lobby-background-image-play'),
            profile: document.getElementById('lobby-background-image-profile'),
            rankings: document.getElementById('lobby-background-image-rankings')
        }
    }

    addEventListeners() {
        this._buttons.upButton.addEventListener('click', this.onUpClicked.bind(this), false)
        this._buttons.downButton.addEventListener('click', this.onDownClicked.bind(this), false)
        this._buttons.mainButton.addEventListener('click', this.onMainButtonClicked.bind(this), false)

        Object.values(this._selectors).forEach((element) => {
            element.addEventListener('transitionend', this.onLobbyRotationAnimationFinished.bind(this), false)
        })
    }

    removeEventListeners() {
        this._buttons.upButton.removeEventListener('click', this.onUpClicked.bind(this), false)
        this._buttons.downButton.removeEventListener('click', this.onDownClicked.bind(this), false)
        this._buttons.mainButton.removeEventListener('click', this.onMainButtonClicked.bind(this), false)

        Object.values(this._selectors).forEach((element) => {
            element.removeEventListener('transitionend', this.onLobbyRotationAnimationFinished.bind(this), false)
        })
    }

    addTabbables() {
        let tabbables = []
        super.addTabbables(tabbables)
    }

    updateSelectorPositions(indexChange) {
        this._pageIndex += indexChange;

        let targetRaw = this._pageIndex % this._pageCount
        let target = Math.abs(targetRaw)
        target = targetRaw > 0 ? 4 - target : target

        let backgroundsArray = Object.values(this._backgrounds)
        let selectorsArray = Object.values(this._selectors)
        let selectorTexts = Object.values(this._selectorText)
        let buttonTexts = Object.values(this._mainButtonText)

        for (let index = 0; index < this._pageCount; index++) {
            // Backgrounds
            let background = backgroundsArray[index]
            if (index === target) {
                background.classList.remove('hidden', 'no-pointer-events')
            } else {
                background.classList.add('hidden', 'no-pointer-events')
            }

            // Selector rotation
            let selector = selectorsArray[index]
            let angle = (this._pageIndex * NINENTY_DEGREES) + (index * NINENTY_DEGREES)
            let offset = DEFAULT_SELECTOR_OFFSET
            let transformString = `rotate(${angle}deg) translate(${offset}px) rotate(${-angle}deg)`
            selector.style.transform = transformString

            if (index === target) {
                selector.classList.add('lobby-selector-active')
            } else {
                selector.classList.remove('lobby-selector-active')
            }

            // Selector text
            let selectorText = selectorTexts[index]
            if (index === target) {
                selectorText.classList.add('hidden', 'no-pointer-events')
            } else {
                selectorText.classList.remove('hidden', 'no-pointer-events')
            }

            // Button text
            let buttonText = buttonTexts[index]
            let offsetIndex = (index + this._pageIndex) % this._pageCount
            offsetIndex = offsetIndex < 0 ? 4 + offsetIndex : offsetIndex

            let replacement = LOBBY_BUTTON_TEXT_STATE[offsetIndex]
            buttonText.classList.add(replacement)

            buttonText.classList.replace('hidden', replacement)
            buttonText.classList.replace('lobby-main-button-text-state-above', replacement)
            buttonText.classList.replace('lobby-main-button-text-state-below', replacement)
            buttonText.classList.replace('lobby-main-button-text-state-active', replacement)
        }
    }

    startMatchMaking() {
        this._presenter.startMatchMaking()
    }

    queueTimerTick() {
        if (this._queueTimerRunning) {
            let newTimeSeconds = (Date.now() - this._queueTimerStartTime - this._queueTimerOffset) / 1000
            let minutes = Math.floor(newTimeSeconds / 60)
            let seconds = (newTimeSeconds - (minutes * 60)).toFixed(0)
    
            this._queueNotificationTimerText.innerHTML = `${minutes}:${String(seconds).padStart(2, '0')}`
        } else {
            let elapsedSinceLastTick = Date.now() - this._queueTimeAtLastTick
            this._queueTimerOffset += elapsedSinceLastTick

            this._queueTimeAtLastTick = Date.now()
        }
    }

    startQueueTimer() {
        this._queueTimeAtLastTick = this._queueTimerStartTime = Date.now()
        this._queueTimerRunning = true
        this._queueTimerOffset = 0

        this._queueTimer = setInterval(this.queueTimerTick.bind(this), QUEUE_TIMER_TICK)
    }

    pauseTimer() {
        this._queueTimerRunning = false
    }

    stopTimer() {
        clearInterval(this._queueTimer)
    }

    onUpClicked() {
        if (this._animating) return
        this._animating = true

        this.updateSelectorPositions(1)
    }

    onDownClicked() {
        if (this._animating) return
        this._animating = true

        this.updateSelectorPositions(-1)
    }

    onLobbyRotationAnimationFinished() {
        this._animating = false
    }

    onMainButtonClicked() {
        let current = Math.abs(this._pageIndex % this._pageCount)
        current = this._pageIndex > 0 ? 4 - current : current

        let target = ['home', 'play', 'profile', 'ranking'][current]

        switch (target) {
            case 'home':

                break;

            case 'play':
                this.onPlayClicked()
                break;

            case 'profile':

                break;
            case 'ranking':

                break;
        }
    }

    onPlayClicked() {
        this._presenter.playClicked()
    }

    onMatchMakingStarted() {
        this._queueNotification.classList.remove(QUEUE_NOTIFICATION_HIDDEN_CLASS)

        this._queueNotificationText.dataset.lkey = QUEUE_NOTIFICATION_LKEY_CONNECTING
        this._queueNotificationText.innerHTML = Localization.get(QUEUE_NOTIFICATION_LKEY_CONNECTING)

        this.startQueueTimer()
    }

    onMatchMakingQueueJoined() {
        this._queueNotification.classList.remove(QUEUE_NOTIFICATION_HIDDEN_CLASS)

        this._queueNotificationText.dataset.lkey = QUEUE_NOTIFICATION_LKEY_SEARCHING
        this._queueNotificationText.innerHTML = Localization.get(QUEUE_NOTIFICATION_LKEY_SEARCHING)
    }

    onMatchMakingReadyCheckStarted() {
        this.pauseTimer()

        if (!this._readyCheckBackgroundVideoDisabled) {
            this._readyCheckBackgroundVideo.play()
        }

        this._readyCheckInProgress = true
    }

    toggleBackgroundVideo(disabled) {
        if (disabled) {
            this._readyCheckBackgroundVideo.pause()
            this.toggleHidden(this._readyCheckBackgroundVideoPoster, false)
        } else {
            if (this._readyCheckInProgress) {
                this._readyCheckBackgroundVideo.play()
            }

            this.toggleHidden(this._readyCheckBackgroundVideoPoster, true)
        }

        this._readyCheckBackgroundVideoDisabled = disabled
    }
}

module.exports = LobbyView