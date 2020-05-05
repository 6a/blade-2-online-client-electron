const BaseView = require('./baseview.js')
const LobbyPresenter = require('../presenter/lobbypresenter.js')
const { Localization } = require('../utility')

const DEFAULT_SELECTOR_OFFSET = 190
const NINENTY_DEGREES = 90
const QUEUE_TIMER_TICK = 1000 / 10
const READY_CHECK_TICK = 1000 / 10

const LOBBY_BUTTON_TEXT_STATE = ['lobby-main-button-text-state-active', 'lobby-main-button-text-state-below', 'hidden', 'lobby-main-button-text-state-above']

const QUEUE_NOTIFICATION_HIDDEN_CLASS = 'lobby-queue-notification-hidden'
const READY_CHECK_HIDDEN_CLASSES = ['hidden', 'no-pointer-events']
const DEFAULT_HIDDEN_CLASS = 'hidden'

const LKEY_CONNECTING = 'connectingToServer'
const LKEY_SEARCHING = 'searchingForAGame'
const LKEY_WAITING_FOR_OPPONENT_TO_ACCEPT = 'waitingForOpponentToAccept'
const LKEY_PREPARING_MATCH = 'preparingMatch'
const LKEY_FAILED_READY_CHECK = 'failedReadyCheck'
const LKEY_OPPONENT_FAILED_READY_CHECK = 'opponentFailedReadyCheck'

const READY_CHECK_PROGRESS_BAR_ANIMATION_CLASS = 'ready-check-20s'
const READY_CHECK_PROGRESS_BAR_WARNING_FLASH_CLASS = 'ready-check-progress-bar-flash-20s'
const READY_CHECK_FORCE_TRANSITION_END_CLASS = 'force-transition-finish'
const READY_CHECK_POST_CONFIRM_WAIT = 5000

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

        this._queueTimerHandle
        this._queueTimerStartTime
        this._queueTimerRunning = false
        this._queueTimerOffset = 0
        this._queueTimeAtLastTick = 0

        this._delayedReadyCheckClose
        this._readyCheckBackgroundVideoDisabled = false
        this._readyCheckInProgress = false
        this._opponentAcceptedReadyCheck = false
        this._acceptedReadyCheck = false

        this._presenter.requestBackgroundVideoActive()
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('lobby')

        this._queueNotification = document.getElementById('lobby-queue-notification')
        this._queueNotificationTimerText = document.getElementById('lobby-queue-notification-small-timer')
        this._queueNotificationText = document.getElementById('lobby-queue-notification-small-message')

        this._readyCheckWrapper = document.getElementById('lobby-queue-ready-check-wrapper')
        this._readyCheckBackgroundVideo = document.getElementById('ready-check-bg-video')
        this._readyCheckBackgroundVideoPoster = document.getElementById('ready-check-video-poster')
        this._readyCheckProgressBar = document.getElementById('lobby-queue-ready-check-progress-bar-fill')
        this._readyCheckProgressBarWrapper = document.getElementById('lobby-queue-ready-check-progress-bar-background')
        this._readyCheckInfoText = document.getElementById('ready-check-info-text')
        this._readyCheckAcceptButton = document.getElementById('ready-check-accept-button')
        this._readyCheckButtonsWrapper = document.getElementById('ready-check-buttons-wrapper')

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
        this._readyCheckAcceptButton.addEventListener('click', this.onReadyCheckAccepted.bind(this), false)

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

        this._queueTimerHandle = setInterval(this.queueTimerTick.bind(this), QUEUE_TIMER_TICK)
    }

    pauseQueueTimer() {
        this._queueTimerRunning = false
    }

    resumeQueueTimer() {
        this._queueTimerRunning = true
    }

    stopQueueTimer() {
        clearInterval(this._queueTimerHandle)
    }

    startReadyCheck() {
        this._readyCheckInProgress = true
    }

    matchMakingOpponentReady() {
        this._opponentAcceptedReadyCheck = true

        if (this._acceptedReadyCheck) {
            this.setReadyCheckInfoText(LKEY_PREPARING_MATCH)
        }
    }

    matchMakingStarted() {
        this._queueNotification.classList.remove(QUEUE_NOTIFICATION_HIDDEN_CLASS)

        this._queueNotificationText.dataset.lkey = LKEY_CONNECTING
        this._queueNotificationText.innerHTML = Localization.get(LKEY_CONNECTING)

        this.startQueueTimer()
    }

    matchMakingQueueJoined() {
        this._queueNotification.classList.remove(QUEUE_NOTIFICATION_HIDDEN_CLASS)

        this._queueNotificationText.dataset.lkey = LKEY_SEARCHING
        this._queueNotificationText.innerHTML = Localization.get(LKEY_SEARCHING)
    }

    matchMakingReadyCheckStarted() {
        this.cancelReadyCheckClose()

        this.pauseQueueTimer()
        
        this._readyCheckWrapper.classList.remove(...READY_CHECK_HIDDEN_CLASSES)
        this._readyCheckProgressBar.classList.add(READY_CHECK_PROGRESS_BAR_ANIMATION_CLASS)
        this._readyCheckProgressBarWrapper.classList.add(READY_CHECK_PROGRESS_BAR_WARNING_FLASH_CLASS)
        this._readyCheckButtonsWrapper.classList.remove(DEFAULT_HIDDEN_CLASS)
        this._readyCheckInfoText.classList.add(DEFAULT_HIDDEN_CLASS)

        if (!this._readyCheckBackgroundVideoDisabled) {
            this._readyCheckBackgroundVideo.currentTime = 0
            this._readyCheckBackgroundVideo.play()
        }

        this.startReadyCheck()
    }

    matchMakingEndReadyCheck(resumeTimer) {
        if (resumeTimer) {
            this.resumeQueueTimer()
        } else {
            this.stopQueueTimer()
        }

        this._readyCheckWrapper.classList.add(...READY_CHECK_HIDDEN_CLASSES)
        this._readyCheckProgressBar.classList.remove(READY_CHECK_PROGRESS_BAR_ANIMATION_CLASS)
        this._readyCheckProgressBarWrapper.classList.remove(READY_CHECK_PROGRESS_BAR_WARNING_FLASH_CLASS, READY_CHECK_FORCE_TRANSITION_END_CLASS)

        this._readyCheckBackgroundVideo.pause()
    }

    setReadyCheckInfoText(lkey) {
        this._readyCheckInfoText.dataset.lkey = lkey
        this._readyCheckInfoText.innerHTML = Localization.get(lkey)
    }

    matchMakingComplete() {
        this.readyCheckShowInfo()
        this.setReadyCheckInfoText(LKEY_PREPARING_MATCH)
        this._queueNotification.classList.add(QUEUE_NOTIFICATION_HIDDEN_CLASS)

        this.cancelReadyCheckClose()

        this._delayedReadyCheckClose = setTimeout(() => {
            this.matchMakingEndReadyCheck(false)
        }, READY_CHECK_POST_CONFIRM_WAIT);
    }

    opponentFailedReadyCheck() {
        this.readyCheckShowInfo()
        this.setReadyCheckInfoText(LKEY_OPPONENT_FAILED_READY_CHECK)

        this.cancelReadyCheckClose()

        this._delayedReadyCheckClose = setTimeout(() => {
            this.matchMakingEndReadyCheck(true)
        }, READY_CHECK_POST_CONFIRM_WAIT);
    }

    failedReadyCheck() {
        this.readyCheckShowInfo()
        this.setReadyCheckInfoText(LKEY_FAILED_READY_CHECK)
        this._queueNotification.classList.add(QUEUE_NOTIFICATION_HIDDEN_CLASS)

        this.cancelReadyCheckClose()

        this._delayedReadyCheckClose = setTimeout(() => {
            this.matchMakingEndReadyCheck(false)
        }, READY_CHECK_POST_CONFIRM_WAIT);
    }

    readyCheckShowInfo() {
        this._readyCheckProgressBar.classList.replace(READY_CHECK_PROGRESS_BAR_ANIMATION_CLASS, READY_CHECK_FORCE_TRANSITION_END_CLASS)
        this._readyCheckProgressBarWrapper.classList.remove(READY_CHECK_PROGRESS_BAR_WARNING_FLASH_CLASS)
        this._readyCheckInfoText.classList.remove(DEFAULT_HIDDEN_CLASS)
        this._readyCheckButtonsWrapper.classList.add(DEFAULT_HIDDEN_CLASS)
    }

    cancelReadyCheckClose() {
        if (this._delayedReadyCheckClose) {
            clearTimeout(this._delayedReadyCheckClose)
            this._delayedReadyCheckClose = null
        }
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

    onReadyCheckAccepted() {
        this._presenter.acceptReadyCheck()
        this._acceptedReadyCheck = true

        this.readyCheckShowInfo()

        if (this._opponentAcceptedReadyCheck) {
            this.setReadyCheckInfoText(LKEY_PREPARING_MATCH)
        } else {
            this.setReadyCheckInfoText(LKEY_WAITING_FOR_OPPONENT_TO_ACCEPT)
        }
    }
}

module.exports = LobbyView