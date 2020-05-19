const BaseView = require('./baseview.js')
const HomePresenter = require('../presenter/homepresenter.js')
const sound = require('../../utility/sound')

class RankingsView extends BaseView {
    constructor (viewsList) {
        super('home', HomePresenter, viewsList, 'hidden')
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
        this._wrapper = document.getElementById('home')

        this._returnButton = document.getElementById('home-return-button')
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

        sound.play(sound.CLOSE)
    }

    // setActive(active) {
    //     if (active) {
    //         this.clear()
    //         this.onRetryButtonClicked()
    //     }

    //     super.setActive(active)
    // }
}

module.exports = RankingsView