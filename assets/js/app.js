const mvp = require('../assets/js/mvp')
const models = new mvp.utility.ModelGetter()

function createModels() {
    models.add(new mvp.model.LoginModel())
    models.add(new mvp.model.DBModel())
    models.add(new mvp.model.NetModel())
}

function start() {
    createModels()
}

start()