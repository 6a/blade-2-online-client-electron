const models = {}

class ModelGetter {
    constructor() {

    }

    get(name) {
        if (models.hasOwnProperty(name)) {
            return models[name]
        } else {
            console.log(`The model ${name} could not be found. Have you initialized it properly?`)
            return null
        }
    }

    add(model) {
        if (!models.hasOwnProperty(model.name)) {
           models[model.name] = model
        } else {
            console.log(`The model "${model.name}" already exists.`)
        }
    }
}

module.exports = ModelGetter