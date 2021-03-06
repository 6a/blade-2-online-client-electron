const BaseView = require('./baseview.js')
const MatchSelectPresenter = require('../presenter/matchselectpresenter.js')
const sound = require('../../utility/sound')

class MatchSelectView extends BaseView {
    constructor (viewsList) {
        super('matchselect', MatchSelectPresenter, viewsList, 'hidden')
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
        this._wrapper = document.getElementById('select-match-type')
        
        this._tutorialButton = document.getElementById('lobby-match-type-select-row-tutorial')
        this._aiMatchButton = document.getElementById('lobby-match-type-select-row-ai-match')
        this._rankedMatchButton = document.getElementById('lobby-match-type-select-row-ranked-match')
        this._returnButton = document.getElementById('lobby-match-type-select-return-button')

    }

    addEventListeners() {
        this._tutorialButton.addEventListener('click', this.onTutorialButtonClicked.bind(this), false)
        this._aiMatchButton.addEventListener('click', this.onAIMatchButtonClicked.bind(this), false)
        this._rankedMatchButton.addEventListener('click', this.onRankedMatchButtonClicked.bind(this), false)
        this._returnButton.addEventListener('click', this.onReturnClicked.bind(this), false)

        document.addEventListener('keydown', this.onEscDown.bind(this), false)
    }

    removeEventListeners() {
        this._returnButton.removeEventListener('click', this.onReturnClicked.bind(this), false)

        document.removeEventListener('keydown', this.onEscDown.bind(this), false)
    }

    addTabbables() {
        let tabbables = [
            this._tutorialButton,
            this._aiMatchButton,
            this._rankedMatchButton,
            this._returnButton,
        ]

        super.addTabbables(tabbables)
    }

    onTutorialButtonClicked(event) {
        event.preventDefault()
        this._presenter.requestTutorial()

        this._wrapper.classList.add('force-no-transition')

        sound.play(sound.POSITIVE)
    }

    onAIMatchButtonClicked(event) {
        event.preventDefault()
        this._presenter.requestAIMatch()

        this._wrapper.classList.add('force-no-transition')

        sound.play(sound.POSITIVE)
    }

    onRankedMatchButtonClicked(event) {
        event.preventDefault()
        this._presenter.requestRankedMatch()

        sound.play(sound.POSITIVE)
    }

    onReturnClicked(event) {
        event.preventDefault()
        this._presenter.closeForm()

        sound.play(sound.CLOSE)
    }

    setActive(active) {
        if (active) {
            this._wrapper.classList.remove('force-no-transition')
        }

        super.setActive(active)
    }
}

module.exports = MatchSelectView