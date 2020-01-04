const models = {}
const history = []

class Models {
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

    addToHistory(modelName) {
        history.push(modelName)
        if (history.length > 5) {
            history.shift()
        }
    }

    peekCurrentName() {
        return history[Math.max(history.length - 1, 0)]
    }

    peekCurrentObject() {
        return this.get(history[Math.max(history.length - 1, 0)])
    }

    popToPrevious(currentModelName) {
        let top = history[Math.max(history.length - 1, 0)]
        
        while (top === currentModelName && history.length > 0) {
            history.pop()
            top = history[Math.max(history.length - 1, 0)]
        }

        return top
    }
}

module.exports = Models