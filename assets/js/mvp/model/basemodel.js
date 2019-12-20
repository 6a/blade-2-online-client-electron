const ModelGetter = require('../utility/modelgetter')

class BaseModel {
    constructor (modelName) {
        this._name = modelName
        this._models = new ModelGetter()
        this._eventRefs = []
    }

    get name () {
        return this._name
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
}

module.exports = BaseModel