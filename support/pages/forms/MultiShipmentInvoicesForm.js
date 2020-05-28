import { basicHelper } from '../../helpers/BasicHelper'

const priceTab = '.inlineManual_CINVOICES_Price'
const amountOwningInputs = '.inlineManual_CINVOICES_TOTPRICE'
const referenceTab = '.inlineManual_CINVOICES_References'
const entryNumberInputs = '.inlineManual_CINVOICES_FNCNUM'
const invoiceNumberInputs = '.inlineManual_CINVOICES_IVNUM'

export const multiShipmentInvoicesForm = {

    async clickPriceTab() {
        await page.waitForSelector(priceTab, { visible: true })
        await expect(page).toClick(priceTab, { timeout: 2000 })
    },

    async getAmountOwing(i = 0) {
        await basicHelper.isElementVisibleByWidth(amountOwningInputs, i)
        await basicHelper.waitForInputNotEmpty(amountOwningInputs)
        return await basicHelper.getInputValue(amountOwningInputs, i)
    },

    async clickReferenceTab() {
        await page.waitForSelector(referenceTab, { visible: true, timeout: 2000 })
        let startTime = Date.now()
        let count = 0
        do {
            ++count
            await page.click(referenceTab)
        } while (
            !(await basicHelper.isElementVisible(referenceTab + '[aria-pressed="true"]', 200))
            && Date.now() - startTime < 8000
        )
        console.log('Clicked ' + referenceTab + ' ' + count + ' times')
    },

    async selectEntryNumberInput(i = 0) {
        await basicHelper.isElementVisibleByWidth(entryNumberInputs)
        await basicHelper.clickUntilInputNotReadOnly(entryNumberInputs, i)
    },

    async getInvoiceNumber(i = 0) {
        await basicHelper.isElementVisibleByWidth(invoiceNumberInputs, { visible: true, timeout: 5000 })
        return await basicHelper.getInputValue(invoiceNumberInputs, i)
    }
}