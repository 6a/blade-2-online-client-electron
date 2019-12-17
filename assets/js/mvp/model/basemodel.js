class BaseModel {
    constructor (modelName) {
        this._name = modelName
    }

    get name () {
        return this._name
    }

    init() {

    }

    destroy() {

    }
}

module.exports = BaseModel