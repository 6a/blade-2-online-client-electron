const BaseView = require('./baseview.js')
const LobbyPresenter = require('../presenter/lobbypresenter.js')
const MarkdownIt = require('markdown-it')

const DEFAULT_SELECTOR_OFFSET = 190
const NINENTY_DEGREES = 90

class LobbyView extends BaseView {
    constructor (viewsList) {
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
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('lobby')

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

        Object.values(this._selectors).forEach((element) => {
            element.addEventListener('transitionend', this.onLobbyRotationAnimationFinished.bind(this), false)
        })
    }

    removeEventListeners() {
        this._buttons.upButton.removeEventListener('click', this.onUpClicked.bind(this), false)
        this._buttons.downButton.removeEventListener('click', this.onDownClicked.bind(this), false)

        Object.values(this._selectors).forEach((element) => {
            element.removeEventListener('transitionend', this.onLobbyRotationAnimationFinished.bind(this), false)
        })
    }

    addTabbables() {
        let tabbables = []
        super.addTabbables(tabbables)
    }

    setContentPanel(target) {
        // Object.values(this._containers).forEach((element) => {
        //     this.toggleHidden(element, true)
        //     element.classList.add('no-pointer-events')
        // })

        // this.toggleHidden(this._containers[target], false)
        // this._containers[target].classList.remove('no-pointer-events')

    }

    setCurrentNavButton(target) {
        // Object.values(this._nav).forEach((element) => {
        //     element.classList.remove('lobby-header-nav-button-current')
        // })

        // this._nav[target].classList.add('lobby-header-nav-button-current')
    }

    updateSelectorPositions() {
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

            // Selector text
            let selectorText = selectorTexts[index]
            if (index === target) {
                selectorText.classList.add('hidden', 'no-pointer-events')
            } else {
                selectorText.classList.remove('hidden', 'no-pointer-events')
            }

            // Button text
            let buttonText = buttonTexts[index]
            if (index === target) {
                buttonText.classList.remove('hidden', 'no-pointer-events')
            } else {
                buttonText.classList.add('hidden', 'no-pointer-events')
            }
        }
    }

    onNavButtonClicked(event) {
        // let element = event.srcElement
        // let target = element.dataset.navtarget

        // this.setContentPanel(target)
        // this.setCurrentNavButton(target)
    }

    onMatchmakingClicked() {
        
    }
    
    onBotGameClicked() {
        
    }

    onUpClicked() {
        if (this._animating) return
        this._animating = true

        this._pageIndex--
        this.updateSelectorPositions()
    }

    onDownClicked() {
        if (this._animating) return
        this._animating = true

        this._pageIndex++
        this.updateSelectorPositions()
    }

    onLobbyRotationAnimationFinished() {
        this._animating = false
    }
}

module.exports = LobbyView