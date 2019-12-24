const noSpaceAtStart = /^[^\s]+/
const usernameValidChars = /^[一-龯ぁ-ゞァ-ヶA-zＡ-ｚ０-９0-9「」［］【】（）＜＞《》≪≫ー～々〆〤！？～!?<>・\-_… 　]+$/
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