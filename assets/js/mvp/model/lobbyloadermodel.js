const BaseModel = require('./basemodel.js')
const { B2Event, Localization, containers } = require('../utility')
const Settings = require('../../utility/settings')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const Timer = require('../../utility/timer')

class LobbyLoaderModel extends BaseModel {
    constructor () {
        super('lobbyloader')
        this.init()
    }

    init() {
        super.init()

        this.onLobbyReady = new B2Event('Lobby Reader')

        this.addEventListener(this.models.get('login').onLoginFinished.register(this.onLoginFinished.bind(this)))
        
        // document.getElementById("opts-button").addEventListener("click", this.onOptionsClicked.bind(this), false);

        // this._active = false
    }

    destroy() {
        super.destroy()
    }

    onLoginFinished(data) {
        if (data === "") {
            this.show()

            // Replace with any pre-loading
            new Promise(() => {
                setTimeout(() => {
                    this.loadingFinished()
                }, 10);
            })
        }
    }

    loadingFinished() {
        this.hide()
        this.onLobbyReady.broadcast()
    }
}

module.exports = LobbyLoaderModel