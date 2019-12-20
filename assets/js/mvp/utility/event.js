class EventRef {
    constructor(id, target) {
        this._id = id
        this._target = target
    }

    get id() {
        return this._id
    }

    get target() {
        return this._target
    }
}

class B2Event {
    constructor (name) {
        this._name = name
        this._targets = new Map()
        this._referenceCounter = 0
    }

    get name() {
        return this._name
    }

    register(func) {
        if (typeof(func) === 'function') {
            let ref = this._referenceCounter++
            this._targets.set(ref, func)

            return new EventRef(ref, this)
        } else {
            console.error(`Could not register to event [${this._name}] as the provided argument was not a function`)
        }
    }

    unregister(reference) {
        if (this._targets.has(reference)) {
            this._targets.delete(reference)
        }
    }

    broadcast(data) {
        this._targets.forEach((value) => {
            value(data)
        })
    }
}

module.exports = {
    B2Event: B2Event,
    EventRef: EventRef
}