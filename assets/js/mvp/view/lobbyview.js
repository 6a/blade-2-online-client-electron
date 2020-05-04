const BaseView = require('./baseview.js')
const LobbyPresenter = require('../presenter/lobbypresenter.js')
const MarkdownIt = require('markdown-it')

const DEFAULT_SELECTOR_OFFSET = 190
const NINENTY_DEGREES = 90
const QUEUE_TIMER_TICK = 1000 / 10

const LOBBY_BUTTON_TEXT_STATE = ['lobby-main-button-text-state-active', 'lobby-main-button-text-state-below', 'hidden', 'lobby-main-button-text-state-above']

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
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('lobby')

        this._queueNotification = document.getElementById('lobby-queue-notification')
        this._queueNotificationTimerText = document.getElementById('lobby-queue-notification-small-timer')

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
        let newTimeSeconds = (Date.now() - this._queueTimerStartTime) / 1000
        let minutes = Math.floor(newTimeSeconds / 60)
        let seconds = (newTimeSeconds - (minutes * 60)).toFixed(0)

        this._queueNotificationTimerText.innerHTML = `${minutes}:${String(seconds).padStart(2, '0')}`
    }

    startQueueTimer() {
        this._queueTimerStartTime = Date.now()
        this._queueTimer = setInterval(this.queueTimerTick.bind(this), QUEUE_TIMER_TICK)
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
        // TODO change this to handle bot and ranked games.
        // For now its gonna just start ranked matchmaking

        this._buttons.mainButton.disabled = true

        //this.startMatchMaking()
    }

    onMatchMakingQueueJoined() {
        this._queueNotification.classList.remove('lobby-queue-notification-hidden')
        this.startQueueTimer()
    }
}

module.exports = LobbyView