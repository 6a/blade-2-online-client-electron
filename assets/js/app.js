const mvp = require('../assets/js/mvp')
const models = new mvp.utility.ModelGetter()
const views = [] // We store a reference to all the views so that they dont get gc'd

function createModels() {
    models.add(new mvp.model.LoginModel())
    models.add(new mvp.model.DBModel())
    models.add(new mvp.model.NetModel())
    models.add(new mvp.model.LoadingModel())
}

function createViewsAndPresenters() {
    views.push(new mvp.view.LoadingView())
}

function start() {
    window.addEventListener('DOMContentLoaded', (event) => {
        createModels()
        createViewsAndPresenters()
    });
}

start()