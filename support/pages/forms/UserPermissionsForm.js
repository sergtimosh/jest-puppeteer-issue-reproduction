import { basicHelper } from "../../helpers/BasicHelper"

const userNameInputs = 'input.inlineManual_PRIVUSERS_USERLOGIN'
const activeUserCheckbox = 'input.inlineManual_PRIVUSERS_ACTIVE'
const permissionsTab = '.inlineManual_PRIVUSERS_Permissions'

export const userPermissionsForm = {

    async searchUserName(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(userNameInputs, 3000)
        await basicHelper.searchInFormReadOnlyInputValue(userNameInputs, value, i)
        const actualValue = await basicHelper.getInputValue(userNameInputs, i)
        expect(actualValue).toBe(value)
    },

    async clickPermissionsTab() {
        await page.waitForSelector(permissionsTab, { timeout: 3000 })
        await page.click(permissionsTab)
        await basicHelper.waitForNetworkIdle(200)
    },

    async waitUntilUserNameNotInQueryMode() {
        await basicHelper.waitForInputNotInQueryMode(userNameInputs)
    },

    async unCheckActiveUserCheckbox() {
        let checked = await basicHelper.isCheckBoxCheckedByValue(activeUserCheckbox)
        console.log(`Checked=${checked}`)
        if (checked === '✔') {
            await page.click(activeUserCheckbox)
            await basicHelper.waitForNetworkIdle(200)
            checked = await basicHelper.isCheckBoxCheckedByValue(activeUserCheckbox)
            console.log('I tried to click')
        }
        expect(checked).toBe('')
    }

}