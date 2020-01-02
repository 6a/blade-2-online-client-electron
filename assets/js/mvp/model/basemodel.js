const ModelGetter = require('../utility/modelgetter')
const B2Event = require('../utility').B2Event

class BaseModel {
    constructor (modelName) {
        this._name = modelName
        this._models = new ModelGetter()
        this._eventRefs = []
        this._active = false
    }

    get name () {
        return this._name
    }

    addEventListener (ref) {
        this._eventRefs.push(ref)
    }

    init() {
        this.onSetActive = new B2Event(`${this.name} -> Active Toggle`)
    }

    destroy() {
        this._eventRefs.forEach((ref) => {
            ref.target.unregister(ref.id)
        })
    }

    show() {
        this.onSetActive.broadcast(true)
        this._active = true
    }

    hide() {
        this.onSetActive.broadcast(false)
        this._active = false
    }
}

module.exports = BaseModel