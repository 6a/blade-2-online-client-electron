const ModelGetter = require('../utility/modelgetter')

class BasePresenter {
    constructor(view) {
        this._view = view
        this._models = new ModelGetter()
    }

    get name () {
        return this._view._name
    }

    init() {

    }

    destroy() {

    }
}

module.exports = BasePresenter