
import { basicHelper } from '../../helpers/BasicHelper';

const customerNumberInputs = '.inlineManual_AINVOICES_CUSTNAME'
const invoiceStatusInputs = 'input.inlineManual_AINVOICES_STATDES'
const invoiceNumberInputs = '.inlineManual_AINVOICES_IVNUM'

export const salesInvoicesForm = {

    async setCustomerNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(customerNumberInputs, 3000)
        await basicHelper.setFormInputValue(customerNumberInputs, value, i)
        const actualValue = await basicHelper.getInputValue(customerNumberInputs, i)
        expect(actualValue).toBe(value)
    },

    async getStatus() {
        await page.click(invoiceStatusInputs)
        await page.waitForFunction(invoiceStatusInputs =>
            document.querySelector(invoiceStatusInputs)
                .value
                .length > 0, {}, invoiceStatusInputs)
        return await page.$eval(invoiceStatusInputs, el => el.value)
    },

    async getInvoiceNumber() {
        await page.click(invoiceNumberInputs)
        await page.waitForFunction(invoiceNumberInputs =>
            document.querySelector(invoiceNumberInputs)
                .value
                .length > 0, {}, invoiceNumberInputs)
        return await page.$eval(invoiceNumberInputs, el => el.value)
    },
}

export const salesInvoicesFormAssert = {

    async isOrderNumber(text) {
        const number = await salesOrdersForm.getOrderNumber()
        expect(number).toBe(text)
    }
}

const invoiceItemsTab = '.inlineManual_sb_AINVOICEITEMS'
const partNumberInputs = 'input.inlineManual_AINVOICEITEMS_PARTNAME'
const partQuantityInputs = 'input.inlineManual_AINVOICEITEMS_TQUANT'
const partPriceInputs = 'input.inlineManual_AINVOICEITEMS_PRICE'

export const invoiceItemsSubForm = {

    async clickTab() {
        await page.waitForSelector(invoiceItemsTab, { visible: true })
        await expect(page).toClick(invoiceItemsTab, { timeout: 2000 })
    },

    async setPartNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(partNumberInputs, 3000)
        await basicHelper.setFormInputValue(partNumberInputs, value, i)
        const actualValue = await basicHelper.getInputValue(partNumberInputs, i)
        expect(actualValue).toBe(value)
    },

    async setQuantity(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(partQuantityInputs, 3000)
        await basicHelper.setFormInputValue(partQuantityInputs, value, i)
        const actualValue = await basicHelper.getInputValue(partQuantityInputs, i)
        expect(actualValue).toBe(value.toString())
    },

    async setPrice(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(partPriceInputs, 3000)
        await basicHelper.setFormInputValue(partPriceInputs, value, i)
        const actualValue = await basicHelper.getInputValue(partPriceInputs, i)
        expect(actualValue)
            .toBe(value
                .toLocaleString('en-US', {
                    minimumFractionDigits: 2
                }))
    },
}