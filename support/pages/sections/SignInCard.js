import { ELEMENTS_TEXT } from "../../data/elements_text"
import { basicHelper } from "../../helpers/BasicHelper"

const emailInput = 'input[name="email"]'
const passwordInput = 'input[name="password"]'
const signInButton = '.email-signin-button'
const errorMessageBlock = '.animated.error-message'
const showPasswordIcon = '.icon-iconon-show-password-on'
const bottomSectionLinks = '.bottom-section button'
const forgotPasswordLink = '.submit-row button[class*="Button-module_link"]'

export const signInCard = {

    //setters
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

    //actions
    async clickSignIn() {
        const button = await page.waitForSelector(signInButton, { timeout: 2000 })
        await button.click()
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
    },

    async clickForgotPasswordLink() {
        const link = await page.waitForSelector(forgotPasswordLink)
        await link.click()
    },

    async clickSignUpLink() {
        await page.waitForSelector(bottomSectionLinks)
        await basicHelper.clickElementByTextContent(bottomSectionLinks, ELEMENTS_TEXT.SIGN_IN_CARD.SIGN_UP_LINK)
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