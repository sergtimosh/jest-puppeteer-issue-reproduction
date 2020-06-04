import { basicHelper } from "../../helpers/BasicHelper"

const emailInput = 'input[name="email"]'
const passwordInput = 'input[name="password"]'
const signInButton = '.email-signin-button'
const errorMessageBlock = '.animated.error-message'
const showPasswordIcon = '.icon-iconon-show-password-on'

export const signInCard = {

    async setEmail(text) {
        const input = await page.waitForSelector(emailInput, { timeout: 2000 })
        await input.click({ clickCount: 3 })
        await input.type(text)
        const actualValue = await basicHelper.getInputValue(emailInput)
        expect(actualValue).toEqual(text)
    },

    async setPassword(text) {
        const input = await page.waitForSelector(passwordInput, { timeout: 2000 })
        await input.click({ clickCount: 3 })
        await input.type(text)
        const actualValue = await basicHelper.getInputValue(passwordInput)
        expect(actualValue).toEqual(text)
    },

    async clickSignIn() {
        const button = await page.waitForSelector(signInButton, { timeout: 2000 })
        await button.click()
    },

    async clearEmail() {
        await page.waitForSelector(emailInput, { timeout: 2000 })
        await basicHelper.clear(emailInput)
        const actualValue = await basicHelper.getInputValue(emailInput)
        expect(actualValue).toEqual('')
    },

    async clearPassword() {
        await page.waitForSelector(passwordInput, { timeout: 2000 })
        await basicHelper.clear(passwordInput)
        const actualValue = await basicHelper.getInputValue(passwordInput)
        expect(actualValue).toEqual('')
    },

    async clickShowPassword() {
        const icon = await page.waitForSelector(showPasswordIcon, { timeout: 2000 })
        await icon.click()
    }
}

export const signInCardAssert = {

    async isErrorrMessageText(text) {
        await page.waitForSelector(errorMessageBlock, { timeout: 2000 })
        const message = await basicHelper.getElementText(errorMessageBlock)
        expect(message.trim()).toEqual(text)
    },

    async isPasswordHidden() {
        const input = await page.waitForSelector(passwordInput, { timeout: 2000 })
        const attrubute = await page.evaluate((input) => { return input.type }, input)
        expect(attrubute).toEqual("password")
    },

    async isPasswordVisible() {
        const input = await page.waitForSelector(passwordInput, { timeout: 2000 })
        const attrubute = await page.evaluate((input) => { return input.type }, input)
        expect(attrubute).toEqual("text")
    },

}