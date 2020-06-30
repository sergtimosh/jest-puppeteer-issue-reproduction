import { basicHelper } from "../../helpers/BasicHelper"

const emailInput = 'input[name="email"]'
const passwordInput = 'input[name="password"]'
const secondPasswordInput = 'input[name="second password"]'
const signUpButton = 'button[type="submit"]'
const goBackLink = '.social-sign-in-link > button'
const signInLink = '.submit-row div[class*="Label-module_clickable"]'
const signUpConfirmText = '.signup-confirm-text'

export const signUpCard = {

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

    async setSecondPassword(text) {
        const input = await page.waitForSelector(secondPasswordInput, { timeout: 2000 })
        await input.click({ clickCount: 3 })
        await input.type(text)
        const actualValue = await basicHelper.getInputValue(secondPasswordInput)
        expect(actualValue).toEqual(text)
    },

    //actions
    async clickSignUp() {
        const button = await page.waitForSelector(signUpButton)
        await button.click()
    },

    async clickGoBackLink() {
        const button = await page.waitForSelector(goBackLink)
        await button.click()
    },

    async clickSignInLink() {
        const button = await page.waitForSelector(signInLink)
        await button.click()
    },

    //timeouts
    async waitForSignUpButtonNotVisible() {
        await basicHelper.waitForElementGone(signUpButton)
    },

}

export const signUpCardAssert = {

    async isSignUpDisabled() {
        const button = await page.waitForSelector(signUpButton)
        const isDisabled = await page.evaluate(e => e.disabled, button)
        expect(isDisabled).toBeTruthy()
    },

    async isSignUpEnabled() {
        const button = await page.waitForSelector(signUpButton)
        const isDisabled = await page.evaluate(e => e.disabled, button)
        console.log(isDisabled)
        expect(isDisabled).toBeFalsy()
    },

    async isSignUpConfirmText(text) {
        await page.waitForSelector(signUpConfirmText)
        const actualText = await basicHelper.getElementText(signUpConfirmText)
        expect(actualText.trim()).toEqual(text)
    }

}