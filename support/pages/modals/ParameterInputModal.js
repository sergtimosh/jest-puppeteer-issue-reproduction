import { basicHelper } from '../../helpers/BasicHelper';

//selectors
const dropdownOptions = '.inlineManual_chooseItem div';
const partQuantityInput = 'input.inlineManual_UPDATEPARTCOUNT_QUA';
const dialogTitle = '.DialogCaption';
const checkBox = 'input[type="checkbox"]'
const clearBtn = '.inlineManual_inputDlg_clear'
const inputSearchIconTemplate = (text) => `//div[text()="${text}"]//following::td[contains(@class,"zoomButtonChoose_ltr")]`
const inputFieldTemplate = (text) => `//div[text()="${text}"]//following::input[contains(@class,"inputDialogTextBoxStyle")]`


export const commonParameterInputModal = {

    async clickButton(text) {
        await expect(page)
            .toClick('.html-face', {
                text: text,
                timeout: 5000
            })
    },

    async clickSearchIconForInput(text) {
        const xpath = inputSearchIconTemplate(text)
        await page.waitForXPath(xpath, { visible: true })
        const dropDown = await page.$x(xpath)
        await dropDown[0].click()
    },

    async clearInputField(fieldName) {
        const xpath = inputFieldTemplate(fieldName)
        await page.waitForXPath(xpath, { visible: true })
        const inputHandler = await page.$x(xpath)
        await page.evaluateHandle(input => input.value = '', inputHandler[0])
    },

    async setInputValue(fieldName, value) {
        const xpath = inputFieldTemplate(fieldName)
        await page.waitForXPath(xpath, { visible: true })
        const inputHandle = await page.$x(xpath)
        await page.evaluateHandle((input, value) => input.value = value, inputHandle[0], value)
        // await inputHandler[0].type(value)
        const actualValue = await (
            await page.evaluateHandle(input => input.value, inputHandle[0])
        ).jsonValue()
        expect(actualValue).toBe(value)
    },

    async checkOption(text) {
        const button = await page.evaluateHandle((checkBox, text) => {
            return [...document.querySelectorAll(checkBox)]
                .filter(el =>
                    el.nextElementSibling.textContent === text)[0]
        }, checkBox, text)
        let checkBoxChecked = await this.isSelected(button)
        console.log('Checkbox Checked: ' + checkBoxChecked)
        if (!checkBoxChecked) {
            await button.click()
            checkBoxChecked = await this.isSelected(button)
        }
        expect(checkBoxChecked).toBe(true)
    },

    async isSelected(el) {
        return (await el.getProperty('checked')).jsonValue()
    },

    async clickClearValues() {
        await page.waitForSelector(clearBtn, { timeout: 2000 })
        await basicHelper.waitForNetworkIdle(200)
        await page.click(clearBtn)
    },

}

export const commonParameterInputModalAssert = {

    async isModalTitle() {
        await basicHelper.waitForElementSingle(dialogTitle)
        await basicHelper.waitForElementHasTextContent(dialogTitle, 'Parameter Input')
        const titleText = await page.$eval(dialogTitle, el => el.textContent)
        expect(titleText).toBe('Parameter Input')
    },
}

//selectors
const selectWarehouseDropdownIcon = '//div[text()="Warehouse"]//following::td[contains(@class,"zoomButtonChoose_ltr")]';

export const warehouseParameterInputModal = {

    async clickSelectWarehouseIcon() {
        await page.waitForXPath(selectWarehouseDropdownIcon, { visible: true })
        const dropDown = await page.$x(selectWarehouseDropdownIcon)
        await dropDown[0].click()
    },

    async selectOptionFromList(text) {
        await page.waitForSelector(dropdownOptions)
        await basicHelper.clickElementByTextContent(dropdownOptions, text)
    },

    async setPartQuantity(value) {
        await page.waitForSelector(partQuantityInput, { visible: true })
        await basicHelper.setSingleInputValue(partQuantityInput, value)
        const actualValue = await basicHelper.getInputValue(partQuantityInput, 0)
        expect(parseInt(actualValue)).toBe(value)
    },

}

const googleAccessCodeInput = '.inlineManual_GMAIL_ACC'

export const mailParameterInputModal = {

    async setGoogleAccessCode(value) {
        await page.waitForSelector(googleAccessCodeInput, { visible: true, timeout: 8000 })
        await basicHelper.setSingleInputValue(googleAccessCodeInput, value)
        const actualValue = await basicHelper.getInputValue(googleAccessCodeInput, 0)
        expect(actualValue).toBe(value)
    },
}
const selectPartNumberDropdownIcon = '//div[text()="Part Number"]//following::td[contains(@class,"zoomButtonChoose_ltr")]'
const searchFilterButton = '.Lsearch_MBut'
const searchField = '.Lsearch_TextBox'
const searchResultsList = '.inlineManual_chooseItem'

export const partsReportParameterInputModal = {

    async clickSelectPartIcon() {
        await page.waitForXPath(selectPartNumberDropdownIcon, { visible: true })
        const dropDown = await page.$x(selectPartNumberDropdownIcon)
        await dropDown[0].click()
    },

    async  selectFilterByText(text) {
        let startTime = Date.now()
        let btnText = await basicHelper.getElementText(searchFilterButton)
        while (btnText !== text && Date.now() - startTime < 8000) {
            await page.click(searchFilterButton)
            await basicHelper.waitForElementGoneByText(searchFilterButton, btnText)
            btnText = await basicHelper.getElementText(searchFilterButton)
        }
        const isSelected = await basicHelper.isElementHasTextContent(searchFilterButton, text)
        expect(isSelected).toBe(true)

    },

    async setValueIntoSearchField(text) {
        await basicHelper.clear(searchField)
        await page.type(searchField, text)
        const inputText = await basicHelper.getInputValue(searchField)
        expect(inputText).toBe(text)
    },

    async selectFilteredResult(text) {
        await basicHelper.waitForElementHasTextContent(searchResultsList, text)
        await basicHelper.clickElementByTextContent(searchResultsList, text)
    }
}