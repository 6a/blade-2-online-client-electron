(function () {
    const { remote } = require('electron')
    const { shell } = require('electron')
    const { Models, containers, Localization } = require('../mvp/utility')
    const path = require('path')

    let win = remote.getCurrentWindow()
    let app = remote.app
    let trayIcon
    let currentLocale

    function addEventListeners() {
        let models = new Models()
    
        document.getElementById("min-button").addEventListener("click", function (e) {
            win.minimize(); 
        });
    
        // Options button is hooked up from within the app

        // Callback from quit modal
        function onQuitConfirmed() {
            // TODO when queueing is implemented, disconnect from queue before quit
            // or at least send the quit request (but maybe dont wait for it)

            app.quit()
        }
   
        // The close button is hooked up so that it calls the message modal open function to
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

    function createTrayIcon() {
        trayIcon = new remote.Tray(path.join(__dirname, '../../images/icons/app.png'))

        let trayContextMenu = remote.Menu.buildFromTemplate([
            {
                label: 'Quit', click: function () {
                    app.quit()
                }
            }
        ])
        
        trayIcon.setContextMenu(trayContextMenu)

        trayIcon.setToolTip(Localization.get('trayIconTooltip'))
        trayIcon.on('click', function (event) { trayIcon.popUpContextMenu(); event.preventDefault() })
        trayIcon.on('double-click', function (event) { trayIcon.popUpContextMenu(); event.preventDefault() })
        trayIcon.on('right-click', function (event) { trayIcon.popUpContextMenu(); event.preventDefault() })

        trayIcon.on('mouse-move', function (event) { 
            let newLocale = Localization.getLocale()
            if (currentLocale !== newLocale) {
                currentLocale = newLocale
                trayIcon.setToolTip(Localization.get('trayIconTooltip'))

                trayContextMenu = remote.Menu.buildFromTemplate([
                    {
                        label: Localization.get('quit'), click: function () {
                            app.quit()
                        }
                    }
                ])

                trayIcon.setContextMenu(trayContextMenu)
            }
        })
    }

    function setUpTrayIconFunctions() {
        document.requestHideToTray = function () {
            createTrayIcon()
            win.hide();
        }

        document.requestShowFromTray = function () {
            trayIcon.destroy()
            win.show();
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        addEventListeners()
        setUpTrayIconFunctions()
    })
})()