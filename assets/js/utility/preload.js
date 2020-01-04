(function () {
    const remote = require('electron').remote
    const { shell } = require('electron')

    const { Models, containers } = require('../mvp/utility')

    function addEventListeners() {
        let win = remote.getCurrentWindow()
        let models = new Models()

        document.getElementById("min-button").addEventListener("click", function (e) {
            win.minimize(); 
        });
    
        // Options button is hooked up from within the app

        // Callback from quit modal
        function onQuitConfirmed() {
            // TODO when queueing is implemented, disconnect from queue before quit
            // or at least send the quit request (but maybe dont wait for it)

            win.close();
        }
   
        // The close button is hooked up so that it calls the message model open function to
        // Open a dialogue box instead of immediately closing the app
        // This feels pretty hacky so please dont look at this function, actually.
        document.getElementById("close-button").addEventListener("click", function (e) {
            let opts = new containers.MessageConfig({
                titleLKey: 'confirmation',
                questionLKey: 'msgQuitQuestion',
                infoLKey: 'msgQuitInfo',
                positiveButtonTextLKey: 'quit',
                positiveButtonCallback: onQuitConfirmed,
                negativeButtonTextLKey: 'cancel',
            })

            models.get('message').open(opts)
        }); 

        // Allow url hyperlinks to be opened in the users default browser
        document.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
                event.preventDefault()
                shell.openExternal(event.target.href)
                event.target.blur()
              }
        })
    }

    window.addEventListener('DOMContentLoaded', () => {
        addEventListeners();
    })
})()