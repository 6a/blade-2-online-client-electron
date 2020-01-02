(function () {
    const remote = require('electron').remote

    function addEventListeners() {
        let win = remote.getCurrentWindow()
        document.getElementById("min-button").addEventListener("click", function (e) {
            win.minimize(); 
        });
    
        // Options button is hooked up from within the app
   
        document.getElementById("close-button").addEventListener("click", function (e) {
            win.close();
        }); 
    }

    window.addEventListener('DOMContentLoaded', () => {
        addEventListeners();
    })
})()