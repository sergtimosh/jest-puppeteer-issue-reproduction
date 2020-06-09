import { basicHelper } from "../../helpers/BasicHelper"

const sendResetPasswordButton = 'button[type="submit"]'
const emailInput = 'input[name="email"]'

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
}