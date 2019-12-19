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

    addEventRef (ref) {
        this._eventRefs.push(ref)
    }

    init() {

    }

    destroy() {
        this._eventRefs.forEach((ref) => {
            this._models.get('loading').onItemLoaded.unregister(ref)
        })
    }
}

module.exports = BasePresenter