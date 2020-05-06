module.exports = {
    clamp01: (num) => { return Math.min(Math.max(num, 0), 1) },
    isNum: (num) => { return !isNaN(Number(num)) },
}