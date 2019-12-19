const BaseView = require('./baseview.js')
const LoadingPresenter = require('../presenter/loadingpresenter')

class LoadingView extends BaseView {
    constructor () {
        super('loading', LoadingPresenter)
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
        this._loadingBar = document.getElementById('loading-bar')
    }

    updateProgress(progress) {
        this._loadingBar.style.transform = `scaleX(${progress})`

        if (progress >= 1) 
        {
            console.log('Asset loading complete')
        }
    }
}

module.exports = LoadingView