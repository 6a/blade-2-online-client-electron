class ModelGetter {
    constructor() {
        this._models = {}
    }

    get(name) {
        if (this._models.hasOwnProperty(name)) {
            return this._models[name]
        } else {
            console.log(`The model ${name} could not be found. Have you initialized it properly?`)
            return null
        }
    }

    add(model) {
        if (!this._models.hasOwnProperty(model.name)) {
           this._models[model.name] = model
        } else {
            console.log(`The model "${model.name}" already exists.`)
        }
    }
}

module.exports = ModelGetter