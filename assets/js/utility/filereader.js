const fs = require('fs')
const path = require('path')

/**
 * A helper class for writing text data to a text file
 */
class FileReader {
    /**
     * Construct a file writer that will write to the specified path when writeXX() is called
     * @param {string} path - the path to the object that will be written
     */
    constructor(path) {
        this._path = path
    }

    /**
     * Read the content of the specified file, returning it via the callback as a string
     * @param {Function(param, param)} twoArgErrorCallback - Callback function: function(error, data)
     */
    read(twoArgErrorCallback) {
        if (!this._path) {
            twoArgErrorCallback(new Error("File does not exist"), "")
            return
        }

        fs.readFile(this._path, twoArgErrorCallback)
    }
}

module.exports = FileReader