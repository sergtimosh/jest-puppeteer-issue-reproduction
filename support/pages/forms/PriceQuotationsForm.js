import { basicHelper } from '../../helpers/BasicHelper';

const customerNumberInput = 'input.inlineManual_CPROF_CUSTNAME'
const statusInput = 'input.inlineManual_CPROF_STATDES'
const itemizedQuotationTab = '.inlineManual_sb_CPROFITEMS'

export const priceQuotationsForm = {

    async setCustomersNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(customerNumberInput, 3000)
        await basicHelper.setFormInputValue(customerNumberInput, value, i)
        const actualValue = await basicHelper.getInputValue(customerNumberInput, i)
        expect(actualValue).toBe(value)
    },

    async setStatusInput(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(statusInput, 3000)
        await basicHelper.setFormInputValue(statusInput, value, i)
        const actualValue = await basicHelper.getInputValue(statusInput, i)
        expect(actualValue).toBe(value)
    },

    async getStatus(i = 0) {
        await basicHelper.isElementVisibleByWidth(statusInput)
        return await basicHelper.getInputValue(statusInput, i)
    },

    async waitForStatusToChangeFrom(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(statusInput)
        await basicHelper.waitForInputNotValue(statusInput, value, i)
    },
}

const partNumberInput = '.inlineManual_CPROFITEMS_PARTNAME'
const partQuantityInput = '.inlineManual_CPROFITEMS_TQUANT'
const partPriceInput = '.inlineManual_CPROFITEMS_PRICE'

export const itemizedQuotationSubForm = {

    async clickTab() {
        await page.waitForSelector(itemizedQuotationTab, { visible: true })
        await expect(page).toClick(itemizedQuotationTab, { timeout: 2000 })
    },

    async setPartNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(partNumberInput, 3000)
        await basicHelper.setFormInputValue(partNumberInput, value, i)
        const actualValue = await basicHelper.getInputValue(partNumberInput, i)
        expect(actualValue).toBe(value)
    },

    async setQuantity(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(partQuantityInput, 3000)
        await basicHelper.setFormInputValue(partQuantityInput, value, i)
        const actualValue = await basicHelper.getInputValue(partQuantityInput, i)
        expect(actualValue).toBe(value.toString())
    },

    async setPrice(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(partPriceInput, 3000)
        await basicHelper.setFormInputValue(partPriceInput, value, i)
        const actualValue = await basicHelper.getInputValue(partPriceInput, i)
        expect(actualValue)
            .toBe(value
                .toLocaleString('en-US', {
                    minimumFractionDigits: 2
                }))
    },
}