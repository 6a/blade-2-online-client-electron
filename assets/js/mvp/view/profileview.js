const BaseView = require('./baseview.js')
const ProfilePresenter = require('../presenter/profilepresenter.js')

class ProfileView extends BaseView {
    constructor (viewsList) {
        super('profile', ProfilePresenter, viewsList, 'hidden')
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
        this._wrapper = document.getElementById('profile')

        this._returnButton = document.getElementById('lobby-profile-return-button')
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
    }

    setActive(active) {
        // Load

        super.setActive(active)
    }
}

module.exports = ProfileView