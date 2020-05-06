const fs = require('fs')
const path = require('path')

/**
 * A helper class for writing text data to a text file
 */
class FileWriter {
    /**
     * Construct a file writer that will write to the specified path when writeXX() is called
     * @param {string} path - the path to the object that will be written
     */
    constructor(path) {
        this._path = path
    }

    /**
     * Write the specified content to the file, as single line delimited by the specified delimiter
     * @param {string[]} content - The content to write - each array member will be delimited by the specified delimiter
     * @param {string} delimiter - The delimiter for the data
     * @param {Function(param)} oneArgErrorCallback - Callback function: function(error?)
     */
    
    writeDelimited(content, delimiter, oneArgErrorCallback) {
        let outString = ""
        content.forEach(item => {
            outString += item + delimiter
        });

        outString = outString.slice(0, -1)

        fs.mkdirSync(path.dirname(this._path), { recursive: true })
        fs.writeFile(this._path, outString, oneArgErrorCallback)
    }
}

module.exports = FileWriter