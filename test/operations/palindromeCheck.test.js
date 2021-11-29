const palindromeCheck = require('../../operations/palindromeCheck')

test('A string that is not a palindrome should return false', () => {
    expect(palindromeCheck('NotAPalindrome')).toEqual(false)
})

test('A string that is a palindrome should return true', () => {
    expect(palindromeCheck('racecar')).toEqual(true)
})

test('A palindrome should count as true even if it has spaces', () => {
    expect(palindromeCheck('was it a car or a cat I saw')).toEqual(true)
})


test('A palindrome should count as true even if it has a mix of upper/lowercase', () => {
    expect(palindromeCheck('lEveL')).toEqual(true)
})

test('A palindrome should count as true even if it has characters', () => {
    expect(palindromeCheck('Ma-d-am')).toEqual(true)
})