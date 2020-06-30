import { basicHelper } from "../../helpers/BasicHelper"

const sendResetPasswordButton = 'button[type="submit"]'
const emailInput = 'input[name="email"]'
const cancelButton = 'button.form-stroke-button'
const goBackButton = 'a[class*="Link-module_component"]'

export const forgotPasswordCard = {

    //setters
    async setEmail(text) {
        const input = await page.waitForSelector(emailInput, { timeout: 2000 })
        await input.click({ clickCount: 3 })
        await input.type(text)
        const actualValue = await basicHelper.getInputValue(emailInput)
        expect(actualValue).toEqual(text)
    },

    //actions
    async clickResetPasswordButton() {
        const button = await page.waitForSelector(sendResetPasswordButton)
        await button.click()
    },

    async clickGoBackButton() {
        const button = await page.waitForSelector(goBackButton)
        await button.click()
    },

    async clickCancelButton() {
        const button = await page.waitForSelector(cancelButton)
        await button.click()
    }
}

export const forgotPasswordCardAssert = {

    async isSentResetDisabled() {
        const button = await page.waitForSelector(sendResetPasswordButton)
        const isDisabled = await page.evaluate(e => e.disabled, button)
        expect(isDisabled).toBeTruthy()
    },

    async isSentResetEnabled() {
        const button = await page.waitForSelector(sendResetPasswordButton)
        const isDisabled = await page.evaluate(e => e.disabled, button)
        expect(isDisabled).toBeFalsy()
    },

    async isEmailFieldValue(text) {
        await page.waitForSelector(emailInput, { timeout: 2000 })
        const inputValue = await basicHelper.getInputValue(emailInput)
        expect(inputValue).toEqual(text)
    }
}