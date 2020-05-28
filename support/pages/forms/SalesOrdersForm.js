
import { basicHelper } from '../../helpers/BasicHelper';

const customerNumberInputs = '.inlineManual_ORDERS_CUSTNAME'
const orderNumberInputs = '.inlineManual_ORDERS_ORDNAME'
const orderStatusInputs = 'input.inlineManual_ORDERS_ORDSTATUSDES'
const dateInputs = 'input.inlineManual_ORDERS_CURDATE'
const internalDialogTab = '.inlineManual_sb_INTERNALDIALOGTEXT'
const currentActiveCell = '.priCurrentFieldStyle'
const inputSearchIcon = '.icon-icon-arrow_drop_down'
//price tab
const priceTab = '.inlineManual_ORDERS_Price'
const overalDiscountInput = '.inlineManual_ORDERS_PERCENT'
const currencyInput = '.inlineManual_ORDERS_CODE'
const excludeInvisibleTable = 'table:not([style*="display: none"])>tbody>tr>td>'

export const salesOrdersForm = {

    //setters
    async setCustomerNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(customerNumberInputs, 3000)
        await basicHelper.setFormInputValue(customerNumberInputs, value, i)
        const actualValue = await basicHelper.getInputValue(customerNumberInputs, i)
        expect(actualValue).toBe(value)
    },

    async setCustomerNumberNoEnter(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(customerNumberInputs, 3000)
        await basicHelper.setFormInputValueNotEnter(customerNumberInputs, value, i)
        const actualValue = await basicHelper.getInputValue(customerNumberInputs, i)
        expect(actualValue).toBe(value)
    },

    async setOrderNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(orderNumberInputs, 3000)
        await basicHelper.setFormInputValueNotEnter(orderNumberInputs, value, i)
        const actualValue = await basicHelper.getInputValue(orderNumberInputs, i)
        expect(actualValue).toBe(value)
    },

    async searchOrderNumber(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(orderNumberInputs, 3000)
        await basicHelper.searchInFormInputValue(orderNumberInputs, value, i)
        const actualValue = await basicHelper.getInputValue(orderNumberInputs, i)
        expect(actualValue).toBe(value)
    },

    async setStatus(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(orderStatusInputs, 3000)
        await basicHelper.setFormInputValue(orderStatusInputs, value, i)
        const actualValue = await basicHelper.getInputValue(orderStatusInputs, i)
        expect(actualValue).toBe(value)
    },

    //setters - price tab

    async setOveralDiscount(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(overalDiscountInput, 3000)
        await basicHelper.setFormInputValue(overalDiscountInput, value, i)
        const actualValue = await basicHelper.getInputValue(overalDiscountInput, i)
        expect(actualValue)
            .toBe(value
                .toLocaleString('en-US', {
                    minimumFractionDigits: 2
                }))
    },

    async setCurrency(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(currencyInput, 3000)
        await basicHelper.setFormInputValue(currencyInput, value, i)
        const actualValue = await basicHelper.getInputValue(currencyInput, i)
        expect(actualValue).toBe(value)
    },

    //getters
    async getOrderNumber() {
        await page.click(orderNumberInputs)
        await page.waitForFunction(orderNumberInputs =>
            document.querySelector(orderNumberInputs)
                .value
                .length > 0, {}, orderNumberInputs)
        return await page.$eval(orderNumberInputs, el => el.value)
    },

    async getDate(i = 0) {
        await page.waitForSelector(dateInputs, { timeout: 2000 })
        return await basicHelper.getInputValue(dateInputs, i)
    },

    //actions
    async clickPriceTab() {
        const tabButton = await page.waitForSelector(`${excludeInvisibleTable}${priceTab}`, { visible: true })
        await tabButton.click()
        await page.waitForSelector(`${priceTab}[aria-pressed="true"]`, { visible: true })
    },

    async clickIntoCustomersNumberField(i = 0) {
        await page.waitForSelector(customerNumberInputs, { timeout: 5000 })
        const elements = await page.$$(customerNumberInputs)
        await elements[i].click()
    },

    async clickOrderNumber(i = 0) {
        await basicHelper.isElementVisibleByWidth(orderNumberInputs, { timeout: 5000 })
        const elements = await page.$$(orderNumberInputs)
        await elements[i].click()
        await page.waitForSelector(orderNumberInputs + currentActiveCell)
    },

    async clickInternalDialogTab() {
        await expect(page).toClick(internalDialogTab, { timeout: 2000 })
    },

    //timeouts
    async waitUntilCustomerNumberHasValue(i = 0) {
        await basicHelper.waitForInputNotEmpty(customerNumberInputs, i)
    },

    async waitUntilDateHasValue(i = 0) {
        await basicHelper.waitForInputNotEmpty(dateInputs, i)
    },

    async waitUntilOrderNumber() {
        await page.waitForFunction(orderNumberInputs =>
            document.querySelector(orderNumberInputs)
                .value
                .length > 0, {}, orderNumberInputs)
    },

    async waitUntilOrderNumberFieldEmpty(i = 0) {
        await basicHelper.waitForInputEmpty(orderNumberInputs, i)
    },

    async waitUntilOrderNumberNotInQueryMode() {
        await page.waitForSelector(orderNumberInputs + currentActiveCell + '[style*="color: rgb(0, 0, 0)"]')
    },

    async waitUntilStatus(value, timeout = 3000) {
        await page.click(orderStatusInputs)
        await page.waitForFunction((orderStatusInputs, value) =>
            document.querySelector(orderStatusInputs)
                .value === value, { timeout: timeout }, orderStatusInputs, value)
    },
}

export const salesOrdersFormAssert = {

    async isOrderNumber(text) {
        const number = await salesOrdersForm.getOrderNumber()
        expect(number).toBe(text)
    },

    async isDate(text, i = 0) {
        const date = await salesOrdersForm.getDate(i)
        expect(date).toBe(text)
    }
}

const orderItemsTab = '.inlineManual_sb_ORDERITEMS'
const partNumberInputs = 'input.inlineManual_ORDERITEMS_PARTNAME'
const partQuantityInputs = 'input.inlineManual_ORDERITEMS_TQUANT'
const partPriceInputs = 'input.inlineManual_ORDERITEMS_PRICE'
const partDueDateInput = 'input.inlineManual_ORDERITEMS_DUEDATE'

export const orderItemsSubForm = {

    async clickTab() {
        await page.waitForSelector(orderItemsTab, { visible: true })
        await expect(page).toClick(orderItemsTab, { timeout: 2000 })
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

    async setDueDate(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(partDueDateInput, 3000)
        await basicHelper.setFormInputValue(partDueDateInput, value, i)
        const actualValue = await basicHelper.getInputValue(partDueDateInput, i)
        expect(actualValue).toBe(value)
    },

}