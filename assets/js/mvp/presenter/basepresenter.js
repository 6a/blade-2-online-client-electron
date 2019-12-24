const ModelGetter = require('../utility/modelgetter')

class BasePresenter {
    constructor(view) {
        this._view = view
        this._models = new ModelGetter()
        this._eventRefs = []
    }

    get name () {
        return this._view._name
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
}

module.exports = BasePresenter