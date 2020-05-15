module.exports = function isEmptyObject(target) {
    return Object.keys(target).length === 0 && target.constructor === Object
}