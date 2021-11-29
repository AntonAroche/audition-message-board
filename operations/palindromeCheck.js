// Check for a palindrome, ignoring spaces and capitalization.
const palindromeCheck = (text) => {
    text = text.toLowerCase().replace(' ', '')
    const len = text.length

    for (i = 0; i < len / 2; i++) {
        if (text[i] !== text[len - 1 - i]) {
            return false
        }
    }
    return true
}

module.exports = palindromeCheck