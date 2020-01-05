module.exports = class Timer {
    constructor(start = true) {
        this._start = new Date()
        this._stopped = this._start

        if (start) this.start()
    }

    start() {
        this._start = Date.now()
    }

    printElapsed(taskName) {
        console.log(`${taskName} loaded in: ${this.elapsed()}ms`)
    }

    elapsed() {
        return Date.now() - this._start
    }
}