const noSpaceAtStart = /^[^\s]+/
const usernameValidChars = /^[ー一-龯ぁ-ゞァ-ヶ -~Ａ-ｚ０-９！-／：-＠［-｀｛-～、-〜“”‘’´・ 　]+$/
const emailValidFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const passwordValidChars = /^[ -~]+$/
const numberAny = /[0-9]/
const lowercaseAny = /[a-z]/

module.exports = {
    noSpaceAtStart,
    usernameValidChars,
    emailValidFormat,
    passwordValidChars,
    numberAny,
    lowercaseAny
}