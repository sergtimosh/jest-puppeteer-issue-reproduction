import { basicHelper } from "../../helpers/BasicHelper"

const passwordInput = 'input[name="password"]'
const secondPasswordInput = 'input[name="second password"]'
const resetButton = '.submit-row > button'

export const resetPasswordCard = {

    //setters
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
    async clickResetButton() {
        const button = await page.waitForSelector(resetButton)
        await button.click()
    },
}