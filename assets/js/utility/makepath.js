const path = require('path')
const root = require('electron').remote.app.getAppPath()

module.exports = (relative) => { return path.join(root, relative) }