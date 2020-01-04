const fs = require('fs');
const yaml = require('js-yaml')
let Localization = require('../mvp/utility').Localization

const DEFAULT_SETTINGS = new Map([
    ['username', ''],
    ['locale', 'jp'],
    ['masterVolume', 0.8],
    ['backgroundMusicVolume', 0.8],
    ['soundEffectsVolume', 0.8],
    ['disableBackgroundVideos', false]
])

const KEYS = {
    USERNAME: 'username',
    LOCALE: 'locale',
    MASTER_VOLUME: 'masterVolume',
    BGM_VOLUME: 'backroundMusicVolume',
    SFX_VOLUME: 'soundEffectsVolume',
    DISABLE_BACKGROUND_VIDEOS: 'disableBackgroundVideos'
}

const SETTINGS_FILE = './user-settings.yaml'
const DEFAULT_ENCODING = 'utf8'
const DATA = { settings: {}}

function loadSettingsOrMakeDefault() {
    try {
        let fileContents = fs.readFileSync(SETTINGS_FILE, DEFAULT_ENCODING);
        let data = yaml.safeLoad(fileContents);

        if (typeof(data) === 'string') 
        {
            console.error('Settings file appears to be incorrectly formatted')
            createDefault()
        } else {
            let requiresResave = false
            DEFAULT_SETTINGS.forEach((value, key) => {
                if (!data.hasOwnProperty(key)) {
                    console.error(`[Settings] Settings file missing key ${key}`)
                    addDefault(key, data)
                    requiresResave = true
                } else if ((Array.isArray(value) && !Array.isArray(data[key])) || typeof(data[key]) !== typeof(value)) {
                    let expected = Array.isArray(value) ? "array" : typeof(value)
                    let got = Array.isArray(data[key]) ? "array" : typeof(data[key])

                    console.error(`[Settings] Settings key ${key} is the wrong type. Expected: ${expected}, got: ${got}`)

                    addDefault(key, data)
                    requiresResave = true
                }
            })

            Object.keys(data).forEach((key) => {
                if (!DEFAULT_SETTINGS.has(key)) {
                    delete data[key]
                    requiresResave = true
                }
            })

            DATA.settings = data
            if (requiresResave) {
                save(data)
            }
        }
    } catch (e) {
        if (e.code === 'ENOENT' || e.name === 'YAMLException') {
            createDefault()
        } 

        console.error(`Could not load user settings\n${e}`)
    }
}

function createDefault() {
    save(Object.fromEntries(DEFAULT_SETTINGS))
}

function addDefault(key, data) {
    data[key] = DEFAULT_SETTINGS.get(key)
    console.warn(`[Settings] Added default for ${key}`)
}

function save(data) {
    let yamlStr = yaml.safeDump(data);
    fs.writeFile(SETTINGS_FILE, yamlStr, DEFAULT_ENCODING, () => {});
}

function setInternal(key, value, writeToFile = true) {
    if (key === 'locale') {
        if (!Localization) Localization = require('../mvp/utility').Localization
        Localization.setLocale(value)
    }

    DATA.settings[key] = value
    if (writeToFile) save(DATA.settings)
}

class Settings {
    constructor() {
        this.KEYS = KEYS
        loadSettingsOrMakeDefault()
    }

    get(key) {
        return DATA.settings[key]
    }

    getAll() {
        return DATA.settings
    }

    set(key, value) {
        setInternal(key, value, true)
    }

    reset() {
        let defaults = Object.fromEntries(DEFAULT_SETTINGS)
        Object.keys(defaults).forEach((key) => {
            setInternal(key, defaults[key], false)
        })

        save(DATA.settings)
    }
}

module.exports = new Settings()