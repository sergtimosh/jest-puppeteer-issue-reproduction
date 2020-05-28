import { basicHelper } from "../../helpers/BasicHelper"

const nameInput = 'input.inlineManual_CUSTOMERS_CUSTDES'
const numberInput = 'input.inlineManual_CUSTOMERS_CUSTNAME'
const popupTitle = '.popup-title'

export const customersForm = {
    //setters
    async setCustomerName(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(nameInput, 3000)
        await basicHelper.setFormInputValue(nameInput, value, i)
        const actualValue = await basicHelper.getInputValue(nameInput, i)
        expect(actualValue).toBe(value)
    },

    async setCustomerNumber(value, i = 0) {
        await basicHelper.setFormInputValue(numberInput, value, i)
    },

    async searchCustomersNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(numberInput, 3000)
        await basicHelper.searchInFormInputValue(numberInput, value, i)
        await basicHelper.waitForInputNotInQueryMode(numberInput)
        await basicHelper.waitForInputNotEmpty(numberInput)
        const actualValue = await basicHelper.getInputValue(numberInput, i)
        expect(actualValue).toBe(value)
    },

    //getters
    async getCustomersNumber(i = 0) {
        await basicHelper.waitForInputNotEmpty(numberInput, i)
        return await basicHelper.getInputValue(numberInput, i)
    },

    async getCustomersName(i = 0) {
        await basicHelper.waitForInputNotEmpty(nameInput, i)
        return await basicHelper.getInputValue(nameInput, i)
    }
}

export const customersFormAssertion = {

    async isPopupTitleHasText(text) {
        await page.waitForSelector(`${popupTitle}:not(:empty)`, { timeout: 5000 })
        const title = await page.$eval(popupTitle, el => el.textContent)
        expect(title).toBe(text)
    },

    async isCustomerNumberInputHasValue(val, i = 0) {
        await page.waitForSelector(numberInput, { timeout: 10000 })
        await basicHelper.waitForInputNotEmpty(numberInput, i)
        const value = await basicHelper.getInputValue(numberInput, i)
        expect(value).toBe(val)
    }
}