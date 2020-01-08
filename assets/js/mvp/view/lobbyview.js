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
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('lobby')

        this._nav = {
            home: document.getElementById('lobby-home-button'),
            play: document.getElementById('lobby-play-button'),
            profile: document.getElementById('lobby-profile-button'),
            leaderboards: document.getElementById('lobby-leaderboards-button'),
        }

        this._containers = {
            home: document.getElementById('lobby-content-home'),
            play: document.getElementById('lobby-content-play'),
            profile: document.getElementById('lobby-content-profile'),
            leaderboards: document.getElementById('lobby-content-leaderboards'),
        }
    }

    addEventListeners() {
        Object.values(this._nav).forEach((element) => {
            element.addEventListener('click', this.onNavButtonClicked.bind(this), false)
        })
    }

    removeEventListeners() {
        Object.values(this._nav).forEach((element) => {
            element.removeEventListener('click', this.onNavButtonClicked.bind(this), false)
        }) 
    }

    addTabbables() {
        let tabbables = []
        super.addTabbables(tabbables)
    }

    setContentPanel(target) {
        Object.values(this._containers).forEach((element) => {
            this.toggleHidden(element, true)
        })

        this.toggleHidden(this._containers[target], false)
    }

    setCurrentNavButton(target) {
        Object.values(this._nav).forEach((element) => {
            element.classList.remove('lobby-header-nav-button-current')
        })

        this._nav[target].classList.add('lobby-header-nav-button-current')
    }

    onNavButtonClicked(event) {
        let element = event.srcElement
        let target = element.dataset.navtarget

        this.setContentPanel(target)
        this.setCurrentNavButton(target)
    }
}

module.exports = LobbyView