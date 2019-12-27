const noSpaceAtStart = /^[^\s]+/
const usernameValidChars = /^[ー一-龯ぁ-ゞァ-ヶ -~Ａ-ｚ０-９！-／：-＠［-｀｛-～、-〜“”‘’´・ 　]+$/
const emailValidFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordValidChars = /^[ -~]+/
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