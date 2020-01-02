const BaseView = require('./baseview.js')
const OptionsPresenter = require('../presenter/optionspresenter.js')

class OptionsView extends BaseView {
    constructor (viewsList) {
        super('options', OptionsPresenter, viewsList, 'hidden')
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
        this._wrapper = document.getElementById('options')
    }

    addEventListeners() {
        // this._usernameField.addEventListener('input', this.onUsernameFieldChanged.bind(this), false)
        
        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
    }

    removeEventListeners() {
        // this._usernameField.removeEventListener('input', this.onUsernameFieldChanged.bind(this), false)

        document.removeEventListener('keydown', this.onKeyDown.bind(this), false)
    }

    addTabbables() {
        let tabbables = [
            // this._usernameField,
            // this._emailField,
            // this._passwordField,
            // this._showhidePasswordCheckbox,
            // this._submitButton,
            // this._closeAnchor,
        ]

        super.addTabbables(tabbables)
    }

    onKeyDown(event) {
        if (!this._wrapper.classList.contains('hidden')) {
            if (event.keyCode == 27) {
                this._presenter.closeForm()
            }
        } 
    }
}

module.exports = OptionsView