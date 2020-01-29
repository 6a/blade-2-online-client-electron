class B2WS {
    constructor(url, publicId, authToken, eventCallback) {
        this._wsconn = new WebSocket(url)
       
        this._wsconn.onopen = this.onOpen.bind(this)
        this._wsconn.onclose = this.onClose.bind(this)
        this._wsconn.onmessage = this.onMessage.bind(this)
        this._wsconn.onerror = this.onError.bind(this)

        this._pid = publicId
        this._token = authToken
        this._onWSEvent = eventCallback
    }

    registerWSEventCallback(func) {
        this._onWSEvent = func 
    }

    onOpen(evt) {
        this.sendAuth()
    }

    onClose(evt) {
        console.log(`CLOSE: ${evt.code} | ${evt.data}`)
        this._wsconn = null
    }

    onMessage(evt) {
        console.log("RECEIVED: " + evt.data)
        let payload = JSON.parse(evt.data)

        this._onWSEvent(payload)
    }

    onError(evt) {
        console.log("ERROR: " + evt.data)
        this.close()
        this._onWSEvent(this.UNKNOWN_ERROR)
    }

    sendAuth() {
        let payload = {
            code: 200,
            message: `${this._pid}:${this._token}`,
        }

        this._wsconn.send(JSON.stringify(payload))
    }

    sendAccept() {
        this._wsconn.send(JSON.stringify({ code: 301, message: ""}))
    }

    sendCancel() {
        this._wsconn = null
    }

    close() {
        this._wsconn.close()
        this._wsconn = null
    }
}

module.exports = {
    B2WS
}