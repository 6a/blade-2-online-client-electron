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
            var ref = this._referenceCounter++
            this._targets.set(ref, func)

            return ref
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

module.exports = B2Event