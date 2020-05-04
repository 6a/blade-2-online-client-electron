const BaseView = require('./baseview.js')
const SelectMatchTypePresenter = require('../presenter/selectmatchtypepresenter.js')

class SelectMatchTypeView extends BaseView {
    constructor (viewsList) {
        super('selectmatchtype', SelectMatchTypePresenter, viewsList, 'hidden')
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

    onReturnClicked(event) {
        event.preventDefault();
        this._presenter.closeForm()
    }
}

module.exports = SelectMatchTypeView