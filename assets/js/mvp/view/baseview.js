

class BaseView {
    constructor(name, presenterType, viewsList) {
        this._name = name
        this._presenter = new presenterType(this)
        this._viewsList = viewsList
        this._tabbables = []
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

    setActive(active) {
        if (this._wrapper !== undefined && this._wrapper !== null) {
            if (active) {
                this._wrapper.classList.remove('hidden')
            } else {
                this._wrapper.classList.add('hidden')
            }
        }

        document.activeElement.blur()

        this.toggleTabbables(active)
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
}

module.exports = BaseView