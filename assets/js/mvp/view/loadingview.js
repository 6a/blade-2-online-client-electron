const BaseView = require('./baseview.js')
const LoadingPresenter = require('../presenter/loadingpresenter')

class LoadingView extends BaseView {
    constructor (viewsList) {
        super('loading', LoadingPresenter, viewsList)
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
        this._wrapper = document.getElementById('loading')
    }

    updateProgress(progress) {
        this._loadingBar.style.left = `-${100 - (progress * 100)}%`
        this._loadingBar.style.backgroundColor = `hsla(0, 0%, ${50 + progress * 50}%, 1)`
        this._loadingBar.style.boxShadow = `0 0 12px hsla(0, 0%, ${50 + progress * 50}%, 1)`

        if (progress >= 1) 
        {
            this._presenter.loadingComplete()

            new Promise(r => setTimeout(r, 400))
            .then(() => {
                this.fadeOut()
                this.destroy()
            })
        }
    }

    fadeOut() {
        this._wrapper.style.opacity = 0;
        this._wrapper.style.visibility = 'hidden';
    }
}

module.exports = LoadingView