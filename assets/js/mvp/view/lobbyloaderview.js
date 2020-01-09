const BaseView = require('./baseview.js')
const LobbyLoaderPresenter = require('../presenter/lobbyloaderpresenter.js')

class LobbyLoaderView extends BaseView {
    constructor (viewsList) {
        super('lobbyloader', LobbyLoaderPresenter, viewsList, 'hidden')
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
        this._wrapper = document.getElementById('lobby-loader')
    }

    addEventListeners() {

    }

    removeEventListeners() {

    }

    addTabbables() {
        let tabbables = []
        super.addTabbables(tabbables)
    }

}

module.exports = LobbyLoaderView