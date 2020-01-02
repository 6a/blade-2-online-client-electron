const fs = require('fs');
const yaml = require('js-yaml')
const screen = require('electron')

const DEFAULT_SETTINGS = new Map([
    ['username', '']
])

const KEYS = {
    USERNAME: 'username'
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

class Settings {
    constructor() {
        this.KEY_USERNAME = KEYS.USERNAME
        
        loadSettingsOrMakeDefault()
    }

    get(key) {
        return DATA.settings[key]
    }

    set(key, value) {
        DATA.settings[key] = value
        save(DATA.settings)
    }
}

module.exports = new Settings()