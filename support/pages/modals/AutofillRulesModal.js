import { basicHelper } from "../../helpers/BasicHelper"

const dialogTitle = '.DialogCaption'
const newRulePopup = '.GeneratorItemEditor'
const ruleNumberColumn = '.GeneratorManager_numCol'
const dropdowns = (legendText) => `//legend[contains(text(),"${legendText}")]/following-sibling::table//select[contains(@class,"gen_comboBox")]`
const inputs = (legendText) => `//legend[contains(text(),"${legendText}")]/following-sibling::table//input[contains(@class,"gen_textBox")]`
const conditionColumn = '.GeneratorManager_condCol'

export const autofillRulesModal = {

    async setActionInputValue(value, i = 0) {
        await page.waitForXPath(inputs('Do the following:'), { timeout: 2000, visible: true })
        const elHandle = await page.$x(inputs('Do the following:'))
        await basicHelper.setFormInputValueByHandle(elHandle[i], value)
        const actualValue = await basicHelper.getInputValueByHandle(elHandle[i])
        expect(actualValue).toBe(value.toString())
    },

    async setConditionInputValue(value, i = 0) {
        await page.waitForXPath(inputs('If'), { timeout: 2000, visible: true })
        const elHandle = await page.$x(inputs('If'))
        await basicHelper.setFormInputValueByHandle(elHandle[i], value)
        const actualValue = await basicHelper.getInputValueByHandle(elHandle[i])
        expect(actualValue).toBe(value.toString())
    },

    //selectors
    async selectActionDropDownValue(text, i = 0) {
        await page.waitForXPath(dropdowns('Do the following:'), { timeout: 2000 })
        const elHandle = await page.$x(dropdowns('Do the following:'))
        await basicHelper.selectOptionOfElementHandle(elHandle[i], text)
        await elHandle[i].evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
    },

    async selectConditionDropDownValue(text, i) {
        await page.waitForXPath(dropdowns('If'), { timeout: 2000 })
        const elHandle = await page.$x(dropdowns('If'))
        await basicHelper.selectOptionOfElementHandle(elHandle[i], text)
        await elHandle[i].evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
    },

    //timeouts
    async waitForNewRuleModalClosed() {
        await basicHelper.waitForElementGone(newRulePopup, 2000)
    },

    async waitForRulesModalClosed() {
        await basicHelper.waitForElementGone(dialogTitle, 2000)
    },

    async waitForRecordsCountToBe(n) {
        await basicHelper.waitForElementsCount(ruleNumberColumn, n, 2000)
    },

    //other actions
    async countRecords() {
        let recordsNumber
        await page.waitForSelector(ruleNumberColumn, { timeout: 2000 })
            .catch(() => recordsNumber = 0)
        const records = await page.$$(ruleNumberColumn)
        recordsNumber = records.length
        return recordsNumber
    },

    async deleteAllRecords(n) {
        for (let i = 0; i < n; i++) {
            await this.clickButton('Delete')
            await this.waitForRecordsCountToBe(n - 1 - i)
        }
    },

    async clickButton(text) {
        await expect(page)
            .toClick('.html-face', {
                text: text,
                timeout: 5000
            })
    },
}

export const autofillRulesModalAssert = {

    async isTitle(text) {
        await page.waitForSelector(dialogTitle, { timeout: 3000 })
        const titleText = await basicHelper.getElementText(dialogTitle)
        expect(titleText).toBe(text)
    },

    async isNewRuleModalOpened() {
        return await basicHelper.isElementVisible(newRulePopup, 2000)
    },

    async isRulePresentInList(text) {
        await page.waitForSelector(conditionColumn, { timeout: 2000 })
        const records = await page.$$(conditionColumn)
        let descriptions = []
        for (let i = 0; i < records.length; i++) {
            let description = await basicHelper.getElementText(conditionColumn, i)
            descriptions[i] = description
        }
        console.log(descriptions)
        expect(descriptions.toString()).toContain(text)
    },
}