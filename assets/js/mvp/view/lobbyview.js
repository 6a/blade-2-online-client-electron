const BaseView = require('./baseview.js')
const LobbyPresenter = require('../presenter/lobbypresenter.js')
const MarkdownIt = require('markdown-it')

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

        
        this._selectors = {
            rankings: document.getElementById('lobby-selector-item-rankings'),
            home: document.getElementById('lobby-selector-item-home'),
            play: document.getElementById('lobby-selector-item-play'),
            profile: document.getElementById('lobby-selector-item-profile')
        }

        this._backgrounds = {
            home: document.getElementById('lobby-background-image-home'),
            play: document.getElementById('lobby-background-image-play'),
            profile: document.getElementById('lobby-background-image-profile'),
            rankings: document.getElementById('lobby-background-image-rankings')
        }
    }

    addEventListeners() {
        // this._pageComponents.play.matchmaking.addEventListener('click', this.onMatchmakingClicked.bind(this), false)
        this._buttons.upButton.addEventListener('click', this.onUpClicked.bind(this), false)
        this._buttons.downButton.addEventListener('click', this.onDownClicked.bind(this), false)
    }

    removeEventListeners() {
        this._buttons.upButton.removeEventListener('click', this.onUpClicked.bind(this), false)
        this._buttons.downButton.removeEventListener('click', this.onDownClicked.bind(this), false)
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
        ++this._pageIndex

        let target = Math.abs(this._pageIndex % this._pageCount)

        let iteration = 0
        Object.values(this._backgrounds).forEach((element) => {
            if (iteration === target) {
                element.classList.remove('hidden', 'no-pointer-events')
            } else {
                element.classList.add('hidden', 'no-pointer-events')
            }

            ++iteration
        })
    }

    onDownClicked() {
        --this._pageIndex

        let target = Math.abs(this._pageIndex % this._pageCount)

        let iteration = 0
        Object.values(this._backgrounds).forEach((element) => {
            if (iteration === target) {
                element.classList.remove('hidden', 'no-pointer-events')
            } else {
                element.classList.add('hidden', 'no-pointer-events')
            }

            ++iteration
        })
    }
}

module.exports = LobbyView