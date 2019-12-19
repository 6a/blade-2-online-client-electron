

class BaseView {
    constructor(name, presenterType, viewsList) {
        this._name = name
        this._presenter = new presenterType(this)
        this._viewsList = viewsList
    }

    get name () {
        return this._name
    }

    init() {

    }

    destroy() {
        var index = this._viewsList.indexOf(this)
        if (index > -1) {
            this._viewsList.splice(index, 1);
        }

        this._presenter.destroy()
        delete this
    }
}

module.exports = BaseView