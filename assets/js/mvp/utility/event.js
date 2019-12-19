class B2Event {
    constructor (name) {
        this._name = name
        this._targets = new Set()
    }

    register(func) {
        if (typeof(func) === 'function') {
            this._targets.add(func)
        } else {
            console.error(`Could not register to event [${this._name}] as the provided argument was not a function`)
        }
    }

    unregister(func) {
        if (typeof(func) === 'function') {
            this._targets.delete(func)
        } else {
            console.error(`Could not unregister from event [${this._name}] as the provided argument was not a function`)
        }
    }

    broadcast(data) {
        this._targets.forEach((func) => {
            func(data)
        })
    }
}

module.exports = B2Event