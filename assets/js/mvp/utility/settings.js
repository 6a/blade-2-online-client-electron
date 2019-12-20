const fs = require('fs');
const yaml = require('js-yaml')

const DEFAULT_SETTINGS = new Map([
    ['remember-me', false],
    ['username', '']
])

const EXPECTED_KEYS = [
    {name: 'remember-me', type: typeof(DEFAULT_SETTINGS.get('remember-me')) },
    {name: 'username', type: typeof(DEFAULT_SETTINGS.get('username')) },
]

const KEYS = {
    REMEMBER_ME: 'remember-me',
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
            EXPECTED_KEYS.forEach((key) => {
                if (!data.hasOwnProperty(key.name)) {
                    console.error(`Settings file missing key ${key.name}`)
                    createDefault()
                    return
                } else if (typeof(data[key.name]) != key.type) {
                    console.error(`Settings key ${key.name} is the wrong type. Expected: ${key.type}, got: ${typeof(data[key.name])}`)
                    createDefault()
                    return
                }
            })

            DATA.settings = data
        }
    } catch (e) {
        if (e.code = 'ENOENT') {
            createDefault()
        }
    }
}

function createDefault() {
    save(Object.fromEntries(DEFAULT_SETTINGS))
}

function save(data) {
    let yamlStr = yaml.safeDump(data);
    fs.writeFileSync(SETTINGS_FILE, yamlStr, DEFAULT_ENCODING);
}

class Settings {
    constructor() {
        this.KEY_REMEMBER_ME = KEYS.REMEMBER_ME
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