const { Localization, Models } = require('../utility')

class BaseView {
    constructor(name, presenterType, viewsList, showHideClass) {
        this._name = name
        this._presenter = new presenterType(this)
        this._viewsList = viewsList
        this._tabbables = []
        this._showHideClass = showHideClass
    }

    get name () {
        return this._name
    }

    init() {

    }

    destroy() {
        let index = this._viewsList.indexOf(this)
        if (index > -1) {
            this._viewsList.splice(index, 1);
        }

        this._presenter.destroy()
        delete this
    }

    setLocked(locked) {
        document.activeElement.blur()
        this.toggleTabbables(!locked)

    }

    setActive(active) {
        if (this._wrapper !== undefined && this._wrapper !== null && this._showHideClass !== undefined) {
            if (active) {
                this._wrapper.classList.remove(this._showHideClass, 'no-pointer-events')
            } else {
                this._wrapper.classList.add(this._showHideClass, 'no-pointer-events')
            }
        }

        this.setLocked(!active)
    }

    addTabbables(tabbables) {
        this._tabbables = this._tabbables.concat(tabbables)
    }

    toggleTabbables(tabbable) {
        let newIndex = tabbable ? 0 : -1

        this._tabbables.forEach((element) => {
            element.tabIndex = newIndex
        })
    }

    toggleHidden(element, hidden) {
        if (hidden) {
            element.classList.add('hidden')
        } else {
            element.classList.remove('hidden')
        }
    }

    setLocalizedInnerHTML(element, lkey) {
        element.innerHTML = Localization.get(lkey)
        element.dataset.lkey = lkey

        if (element.dataset.justify === 'true') {
            if (Localization.justifyText()) {
                element.classList.add('justify-text')
            } else {
                element.classList.remove('justify-text')
            }
        }
    }

    onEscDown(event) {
        if (new Models().peekCurrentName() === this.name) {
            if (!event.handled) {
                if (event.keyCode === 27) {
                    this._presenter.closeForm()
                }

                event.handled = true
            } 
        }
    }
}

module.exports = BaseView