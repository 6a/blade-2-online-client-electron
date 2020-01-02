const Models = require('../utility').Models

class BasePresenter {
    constructor(view) {
        this._view = view
        this._models = new Models()
        this._eventRefs = []

        this.addEventListener(this.model.onSetActive.register(this.onSetActive.bind(this)))
        this.addEventListener(this.model.onSetLocked.register(this.onSetLocked.bind(this)))
    }

    get name() {
        return this._view._name
    }

    get models() {
        return this._models
    }

    get model() {
        return this._models.get(this.name)
    }

    addEventListener (ref) {
        this._eventRefs.push(ref)
    }

    init() {

    }

    destroy() {
        this._eventRefs.forEach((ref) => {
            ref.target.unregister(ref.id)
        })
    }

    onSetActive(active) {
        this._view.setActive(active)
    }

    onSetLocked(locked) {
        this._view.setLocked(locked)
    }
}

module.exports = BasePresenter