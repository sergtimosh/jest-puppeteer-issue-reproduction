import { basicHelper } from "../../helpers/BasicHelper"

const companyNameInput = '.inlineManual_ENVIRONMENT_DNAME'
const fullCompanyNameInput = '.inlineManual_ENVIRONMENT_TITLE'
const companyActiveInput = '.inlineManual_ENVIRONMENT_ACTIVE'
const companiesRemarksTab = '.inlineManual_sb_ENVIRONMENTTEXT'

export const companiesForm = {

    async setCompanyNameNotEnter(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(companyNameInput, 3000)
        await basicHelper.setFormInputValueNotEnter(companyNameInput, value, i)
        const actualValue = await basicHelper.getInputValue(companyNameInput, i)
        expect(actualValue).toBe(value)
    },

    async setFullCompanyNameNotEnter(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(fullCompanyNameInput, 3000)
        await basicHelper.setFormInputValueNotEnter(fullCompanyNameInput, value, i)
        const actualValue = await basicHelper.getInputValue(fullCompanyNameInput, i)
        expect(actualValue).toBe(value)
    },

    async unCheckActiveCheckbox() {
        let checked = await basicHelper.isCheckBoxCheckedByValue(companyActiveInput)
        console.log(`Checked=${checked}`)
        if (checked === '✔') {
            await page.click(companyActiveInput)
            await basicHelper.waitForNetworkIdle(300)
            checked = await basicHelper.isCheckBoxCheckedByValue(companyActiveInput)
            console.log('I tried to click')
        }
        expect(checked).toBe('')
    },

    async getFullCompanyName(i = 0) {
        await basicHelper.waitForInputNotValue(fullCompanyNameInput, '')
        return await basicHelper.getInputValue(fullCompanyNameInput, i)
    },

    async clickCompaniesRemarksTab() {
        await page.waitForSelector(companiesRemarksTab, { visible: true })
        await expect(page).toClick(companiesRemarksTab, { timeout: 2000 })
    }
}