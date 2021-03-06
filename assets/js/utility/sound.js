const makepath = require('./makepath')
const settings = require('./settings')
const { Howl, Howler } = require('howler');

const SOUNDS_FOLDER =  makepath(require('./appconfig').soundsFolder)
const EXPECTED_SOUNDS = new Map([
    ['select', 'select.webm'],
    ['pulse', 'pulse.webm'],
    ['submit', 'submit.webm'],
    ['positive', 'positive.webm'],
    ['negative', 'negative.webm'],
    ['open', 'open.webm'],
    ['close', 'close.webm'],
])

class Sound {
    constructor(soundsFolder) {
        Howler.html5PoolSize = 40

        this._sounds = new Map()

        EXPECTED_SOUNDS.forEach((soundFile, key, _) => {
            const sound = new Howl({ src: [`${SOUNDS_FOLDER}/${soundFile}`], preload: true, html5: true, pool: 10 })

            this._sounds.set(key, sound)
        })

        this.SELECT = 'select'
        this.PULSE = 'pulse'
        this.SUBMIT = 'submit'
        this.POSITIVE = 'positive'
        this.NEGATIVE = 'negative'
        this.OPEN = 'open'
        this.CLOSE = 'close'
    }

    play(sound) {
        if (this._sounds.has(sound)) {
            const howl = this._sounds.get(sound)

            const masterVolume = settings.get(settings.KEYS.MASTER_VOLUME)
            const sfxVolume = settings.get(settings.KEYS.SFX_VOLUME)

            if (Howler.volume() != masterVolume) {
                Howler.volume(masterVolume)
            }

            if (howl.volume() != sfxVolume) {
                howl.volume(sfxVolume)
            }

            howl.play()

        } else {
            console.error('Requested sound not recognised')
        }
    }
}

module.exports = new Sound(SOUNDS_FOLDER)