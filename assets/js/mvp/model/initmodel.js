const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class InitModel extends BaseModel {
    constructor () {
        super("init")
        this._fontsToLoad = []
        this._imagesToLoad = []
        this._itemsToLoad = 0
        this._totalLoadedItems = 0

        this.onItemLoaded = new B2Event('itemloaded')

        this.init()
    }

    init() {
        super.init()

        document.addEventListener('DOMContentLoaded', () => {
            this.addFonts()
            this.addImages()
            this.startLoad()
        }, false)
    }

    destroy() {
        super.destroy()
    }

    addFonts() {
        this._fontsToLoad.push(new FontFace('Noto Sans JP', 'url(../assets/fonts/NotoSansJP-Black.otf)', { weight: 900 }))
        this._fontsToLoad.push(new FontFace('Noto Sans JP', 'url(../assets/fonts/NotoSansJP-Bold.otf)', { weight: 700 }))
        this._fontsToLoad.push(new FontFace('Noto Sans JP', 'url(../assets/fonts/NotoSansJP-Medium.otf)', { weight: 500 }))
        this._fontsToLoad.push(new FontFace('Noto Sans JP', 'url(../assets/fonts/NotoSansJP-Regular.otf)', { weight: 'normal' }))
        this._fontsToLoad.push(new FontFace('Noto Sans JP', 'url(../assets/fonts/NotoSansJP-Light.otf)', { weight: 300 }))
        this._fontsToLoad.push(new FontFace('Noto Sans JP', 'url(../assets/fonts/NotoSansJP-Thin.otf)', { weight: 100 }))
        this._fontsToLoad.push(new FontFace('Sawarabi Mincho Regular', 'url(../assets/fonts/sawarabi-mincho-regular.ttf)', { weight: 'normal' }))

        this._itemsToLoad += this._fontsToLoad.length
    }

    addImages() {
        this._imagesToLoad = Array.from(document.getElementsByTagName("img"))
        this._itemsToLoad += this._imagesToLoad.length
    }

    startLoad() {
        this._fontsToLoad.forEach((font) => { 
            font.load().then((info) => this.handleItemLoad(info))
        })

        this._imagesToLoad.forEach((image) => { 
            image.addEventListener('load', (info) => this.handleItemLoad(info), false)
        })
    }

    handleItemLoad(info) {
        var percent = this._totalLoadedItems++ / (this._itemsToLoad - 1)
        // console.log("Loading: " + percent)

        this.onItemLoaded.broadcast(percent)
    }
}

module.exports = InitModel