const BaseModel = require('./basemodel.js')

class LoginModel extends BaseModel {
    constructor () {
        super('login')
        this.init()

    }

    init() {
        super.init()
    }

    destroy() {
        super.destroy()
    }
}

module.exports = LoginModel