const Models = require('../utility').Models
const B2Event = require('../utility').B2Event

class BaseModel {
    constructor (modelName) {
        this._name = modelName
        this._models = new Models()
        this._eventRefs = []
        this._active = false
    }

    get name () {
        return this._name
    }

    get models() {
        return this._models
    }

    addEventListener (ref) {
        this._eventRefs.push(ref)
    }

    init() {
        this.onSetActive = new B2Event(`${this.name} -> Active Toggle`)
        this.onSetLocked = new B2Event(`${this.name} -> Lock Toggle`)
    }

    destroy() {
        this._eventRefs.forEach((ref) => {
            ref.target.unregister(ref.id)
        })
    }

    setLocked(locked) {
        this.onSetLocked.broadcast(locked)
    }

    show() {
        this.onSetActive.broadcast(true)
        this._active = true
        this.models.addToHistory(this.name)
    }

    hide() {
        this.onSetActive.broadcast(false)
        this._active = false
    }
}

module.exports = BaseModel