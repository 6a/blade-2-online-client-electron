(function () {
    const remote = require('electron').remote

    function addEventListeners() {
        let win = remote.getCurrentWindow()
        document.getElementById("min-button").addEventListener("click", function (e) {
            win.minimize(); 
        });
    
        document.getElementById("opts-button").addEventListener("click", function (e) {
           document.optsCallback();
        });
    
        document.getElementById("close-button").addEventListener("click", function (e) {
            win.close();
        }); 
    }

    window.addEventListener('DOMContentLoaded', () => {
        addEventListeners();
    })
})()