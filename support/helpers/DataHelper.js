const faker = require('faker')
export const dataHelper = {

    randName(prefix, i = 6, separator = '') {
        const date = Date.now().toString()
        const value = date.substr(date.length - i)
        return `${prefix}${separator}${value}`
    },

    randFulName() {
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        return `${firstName} ${lastName}`
    },

    randEmail(prefix = `test_${Date.now()}`) {
        return faker.internet.email(prefix)
    },

    //arrays
    selectRandomOfArray(arr = []) {
        return arr[Math.floor(Math.random() * arr.length)]
    },

    createSwappedArray(arr, a, b) {
        let newArr = Array.from(arr)
        let temp = arr[a]
        newArr[a] = newArr[b]
        newArr[b] = temp
        return newArr
    },

    moveElementInNewArr(arr, from, to) {
        const newArr = Array.from(arr)
        let el = newArr[from]
        newArr.splice(from, 1)
        newArr.splice(to, 0, el)
        return newArr
    },

    createArrayWithFirstElementMovedToTheEnd(arr) {
        let newArr = Array.from(arr)
        newArr.push(newArr.shift())
        return newArr
    },

    createArrayWithElementMovedToTheEnd(arr, i) {
        let newArr = Array.from(arr)
        newArr.push(newArr.splice(i, 1)[0])
        return newArr
    },

    createSplicedArray(arr, i, n) {
        let newArr = Array.from(arr)
        newArr.splice(i, n)
        return newArr
    },

    shortenArray(arr, length) {
        let newArr = Array.from(arr)
        newArr.length = length
        return newArr
    }
}