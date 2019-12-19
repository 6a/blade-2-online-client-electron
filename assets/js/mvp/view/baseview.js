

class BaseView {
    constructor(name, presenterType) {
        this._name = name
        this._presenter = new presenterType(this)
    }

    get name () {
        return this._name
    }

    init() {

    }

    destroy() {

    }
}

module.exports = BaseView