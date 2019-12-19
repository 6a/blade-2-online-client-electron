const BaseModel = require('./basemodel.js')
const B2Event = require('../utility').B2Event

class LoadingModel extends BaseModel {
    constructor () {
        super('loading')
        this.init()
    }

    init() {
        super.init()

        this._fontsToLoad = []
        this._imagesToLoad = []
        this._itemsToLoad = 0
        this._totalLoadedItems = 0

        this.onItemLoaded = new B2Event('itemloaded')
        this.onLoadingComplete = new B2Event('loadingcomplete')

        this.addFonts()
        this.addImages()
        this.addVideos()
        this.startLoad()
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

    addVideos() {
        this._videosToLoad = Array.from(document.getElementsByTagName("video"))
        this._itemsToLoad += this._videosToLoad.length
    }

    startLoad() {
        this._fontsToLoad.forEach((font) => { 
            font.load().then(this.handleItemLoad.bind(this))
        })

        this._imagesToLoad.forEach((image) => { 
            image.addEventListener('load', this.handleItemLoad.bind(this), false)
        })

        this._videosToLoad.forEach((video) => { 
            if (video.readyState < video.HAVE_FUTURE_DATA) {
                video.addEventListener('canplay', this.handleItemLoad.bind(this), false)
            } else {
                this._itemsToLoad--
            }
        })
    }

    handleItemLoad() {
        var percent = this._totalLoadedItems++ / (this._itemsToLoad - 1)
        this.onItemLoaded.broadcast(percent)
    }

    loadingComplete() {
        this.onLoadingComplete.broadcast()
    }
}

module.exports = LoadingModel