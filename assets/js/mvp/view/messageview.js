const BaseView = require('./baseview.js')
const MessagePresenter = require('../presenter/messagepresenter.js')

class MessageView extends BaseView {
    constructor (viewsList) {
        super('message', MessagePresenter, viewsList, 'hidden')
        this.init()
    }

    init() {
        super.init()

        this.getElementReferences()
        this.addEventListeners()
        this.addTabbables()

        this._positiveCallback = undefined
        this._negativeCallback = undefined

        this.toggleTabbables(false)
    }

    destroy() {
        super.destroy()
    }

    getElementReferences() {
        this._wrapper = document.getElementById('msg')
        this._positiveButton = document.getElementById('msg-modal-button-positive')
        this._negativeButton = document.getElementById('msg-modal-button-negative')

        this._title = document.getElementById('msg-modal-title')
        this._question = document.getElementById('msg-modal-question')
        this._info = document.getElementById('msg-modal-info')
    }

    addEventListeners() {
        this._positiveButton.addEventListener('click', this.onPositiveButtonClicked.bind(this), false)
        this._negativeButton.addEventListener('click', this.onNegativeButtonClicked.bind(this), false)

        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
    }

    removeEventListeners() {
        this._positiveButton.removeEventListener('click', this.onPositiveButtonClicked.bind(this), false)
        this._negativeButton.removeEventListener('click', this.onNegativeButtonClicked.bind(this), false)

        document.removeEventListener('keydown', this.onKeyDown.bind(this), false)
    }

    addTabbables() {
        let tabbables = [
            this._positiveButton,
            this._negativeButton
        ]

        super.addTabbables(tabbables)
    }

    show(opts) {
        this.setLocalizedInnerHTML(this._title, opts.titleLKey)
        this.setLocalizedInnerHTML(this._question, opts.questionLKey)
        this.setLocalizedInnerHTML(this._info, opts.infoLKey)
        this.setLocalizedInnerHTML(this._positiveButton, opts._positiveButtonTextLKey)
        this.setLocalizedInnerHTML(this._negativeButton, opts._negativeButtonTextLKey)

        this._positiveCallback = opts.positiveButtonCallback
        this._negativeCallback = opts.negativeeButtonCallback
    }

    onPositiveButtonClicked() {
        if (this._positiveCallback !== undefined) this._positiveCallback.call()
        this._presenter.closeForm()
    }

    onNegativeButtonClicked() {
        if (this._negativeCallback !== undefined) this._negativeCallback.call()
        this._presenter.closeForm()
    }

    onKeyDown(event) {
        this.onEscDown(event)
        if (event.keyCode === 27) {
            if (this._negativeCallback !== undefined) this._negativeCallback.call()
        }
    }
}

module.exports = MessageView