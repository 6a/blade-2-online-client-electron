(function () {
    const mvp = require('../assets/js/mvp')
    const models = new mvp.utility.Models()
    const views = [] // We store a reference to all the views so that they dont get gc'd

    function createModels() {
        models.add(new mvp.model.BootStrapperModel())
        models.add(new mvp.model.LoadingModel())
        models.add(new mvp.model.OptionsModel())
        models.add(new mvp.model.NetModel())
        models.add(new mvp.model.LoginModel())
        models.add(new mvp.model.CreateAccountModel())
        models.add(new mvp.model.MessageModel())
        // models.add(new mvp.model.LobbyLoaderModel())
        models.add(new mvp.model.LobbyModel())
        models.add(new mvp.model.SelectMatchTypeModel())
    }

    function createViewsAndPresenters() {
        views.push(new mvp.view.LoadingView(views))
        views.push(new mvp.view.LoginView(views))
        views.push(new mvp.view.CreateAccountView(views))
        views.push(new mvp.view.OptionsView(views))
        views.push(new mvp.view.MessageView(views))
        // views.push(new mvp.view.LobbyLoaderView(views))
        views.push(new mvp.view.LobbyView(views))
        views.push(new mvp.view.SelectMatchTypeView(views))
    }

    function start() {
        mvp.utility.Localization.init()
        createModels()
        createViewsAndPresenters()
    }

    // Dont call start until we know the DOM is ready for things like getting references to elements
    window.addEventListener('DOMContentLoaded', () => {
        start()
    });
})()