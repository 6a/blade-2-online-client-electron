(function () {
    const remote = require('electron').remote
    const { shell } = require('electron')

    function addEventListeners() {
        let win = remote.getCurrentWindow()
        document.getElementById("min-button").addEventListener("click", function (e) {
            win.minimize(); 
        });
    
        // Options button is hooked up from within the app
   
        document.getElementById("close-button").addEventListener("click", function (e) {
            win.close();
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