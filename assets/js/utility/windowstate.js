const electronSettings = require('electron-settings')

// Adapted from: https://medium.com/@hql287/persisting-windows-state-in-electron-using-javascript-closure-17fc0821d37

class WindowStateValues {
    constructor(obj) {
        if (obj === undefined) {
            obj = {}
        }

        this.x = obj.x
        this.y = obj.y
    }

    toObject() {
        return {
            x: this.x,
            y: this.y
        }
    }
}

class WindowState {
    constructor(windowName) {
        this._window = undefined
        this._windowName = windowName
        this._state = new WindowStateValues()
        
        this.init()
    }

    get state() {
        return this._state
    }

    init() {
        // Load the stored window state - if it doesnt exist, just continue with the default values
        // that are predefined by the WindowStateValues class
        if (electronSettings.has(`windowState.${this._windowName}`)) {
            this._state = new WindowStateValues(electronSettings.get(`windowState.${this._windowName}`))
        } 
    }

    track(window) {
        this._window = window
        let evts = ['move', 'close']
        
        evts.forEach(event => {
            this._window.on(event, this.save.bind(this))
        })
    }

    save() {
        this._state = new WindowStateValues(this._window.getBounds())
        electronSettings.set(`windowState.${this._windowName}`, this._state.toObject())
    }
}

module.exports = WindowState