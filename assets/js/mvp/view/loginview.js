const BaseView = require('./baseview.js')
const LoginPresenter = require('../presenter/loginpresenter')

class LoginView extends BaseView {
    constructor (viewsList) {
        super('login', LoginPresenter, viewsList)
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._bgVideo = document.getElementById('login-bg-video')
    }

    startBackgroundVideo() {
        // TODO - reenable
        // this._bgVideo.play()
        
    }
}

module.exports = LoginView