import { basicHelper } from "../../helpers/BasicHelper"

const emailInput = 'input[name="email"]'
const passwordInput = 'input[name="password"]'
const signInButton = '.email-signin-button'

export const signInCard = {

    async setEmail(text) {
        const input = await page.waitForSelector(emailInput, { timeout: 2000 })
        await input.type(text)
        const actualValue = await basicHelper.getInputValue(emailInput)
        expect(actualValue).toEqual(text)
    },

    async setPassword(text) {
        const input = await page.waitForSelector(passwordInput, { timeout: 2000 })
        await input.type(text)
        const actualValue = await basicHelper.getInputValue(passwordInput)
        expect(actualValue).toEqual(text)
    },

    async clickSignIn() {
        const button = await page.waitForSelector(signInButton, { timeout: 2000 })
        await button.click()
    }
}

export const signInCardAssert = {
}