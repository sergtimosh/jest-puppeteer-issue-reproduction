import { basicHelper } from "../../helpers/BasicHelper"

const dialogTitle = '.DialogCaption'
const ruleDescriptionInput = '.gen_txtDescription'
const messageSubjectInput = '.TextBox_Subject1'
const messageInput = '.gen_textArea'
const actionDropdown = '.gen_type_comboBox'
const ifDropdowns = '.conditionPanelTableDiv .gen_comboBox'
const ifInputs = '.conditionPanelTableDiv .gen_textBox'
const descriptionColumn = '.GeneratorManager_detailsCol'
const sendMailToInput = '.gen_textBox.W_140'
const allVisibleDropdowns = '.gen_comboBox:not([style*="display: none"])'
const whenRadioButtons = '.conditionPanelTableDiv input[type="radio"]'
const isActiveColumnCheckboxes = '.GeneratorManager_activeCol input'
const ruleNumberColumn = '.GeneratorManager_numCol'
const actionColumn = '.GeneratorManager_actionCol'
const detailsColumn = '.GeneratorManager_detailsCol'
const conditionColumn = '.GeneratorManager_condCol'

export const businessRulesModal = {

    //input setters
    async setDescription(text) {
        await page.waitForSelector(ruleDescriptionInput, { timeout: 2000 })
        await basicHelper.setFormInputValueNotEnter(ruleDescriptionInput, text)
        const actualValue = await basicHelper.getInputValue(ruleDescriptionInput)
        expect(actualValue).toBe(text)
    },

    async setSubject(text) {
        const elHandle = await page.waitForSelector(messageSubjectInput, { timeout: 2000 })
        await basicHelper.setFormInputValueNotEnter(messageSubjectInput, text)
        const actualValue = await basicHelper.getInputValue(messageSubjectInput)
        await elHandle.evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
        expect(actualValue).toBe(text)
    },

    async setMessage(text) {
        const elHandle = await page.waitForSelector(messageInput, { timeout: 2000 })
        await basicHelper.setFormInputValueNotEnter(messageInput, text)
        const actualValue = await basicHelper.getInputValue(messageInput)
        await elHandle.evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
        expect(actualValue).toBe(text)
    },

    async setMailToInput(text) {
        const elHandle = await page.waitForSelector(sendMailToInput, { timeout: 2000 })
        await basicHelper.setFormInputValueNotEnter(sendMailToInput, text)
        const actualValue = await basicHelper.getInputValue(sendMailToInput)
        await elHandle.evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
        expect(actualValue).toBe(text)
    },

    async setConditionInputValue(value, i = 0) {
        await page.waitForSelector(ifInputs, { timeout: 2000, visible: true })
        await basicHelper.setFormInputValueNotEnter(ifInputs, value, i)
        const actualValue = await basicHelper.getInputValue(ifInputs, i)
        expect(actualValue).toBe(value.toString())
    },

    //getters
    async getRuleNumber(i = 0) {
        await page.waitForSelector(ruleNumberColumn, { timeout: 2000 })
        return await basicHelper.getElementText(ruleNumberColumn, i)
    },

    //selectors
    async selectActionDropDownValue(text) {
        const elHandle = await page.waitForSelector(`${actionDropdown}:not([disabled])`, { timeout: 2000 })
        await basicHelper.selectElementOption(actionDropdown, text)
        await elHandle.evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
    },

    async selectConditionDropDownValue(text, i) {
        await page.waitForSelector(`${ifDropdowns}:not([disabled])`, { timeout: 2000 })
        const elHandle = await page.$$(ifDropdowns)
        await basicHelper.selectElementOption(ifDropdowns, text, i)
        await elHandle[i].evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
    },

    async selectDropdownByOrder(text, i) {
        await page.waitForSelector(allVisibleDropdowns, { timeout: 2000 })
        const elHandle = await page.$$(allVisibleDropdowns)
        await basicHelper.selectElementOption(allVisibleDropdowns, text, i)
        await elHandle[i].evaluate(dropDown => dropDown.dispatchEvent(new Event('change')))
    },

    //timeouts
    async waitForNewRuleModalClosed() {
        await basicHelper.waitForElementGone(ruleDescriptionInput, 2000)
    },

    async waitForRuleModalClosed() {
        await basicHelper.waitForElementGone(dialogTitle, 2000)
    },

    async waitForRecordsCountToBe(n) {
        await basicHelper.waitForElementsCount(descriptionColumn, n, 2000)
    },

    //other actions
    async countRecords() {
        let recordsNumber
        await page.waitForSelector(descriptionColumn, { timeout: 2000 })
            .catch(() => recordsNumber = 0)
        const records = await page.$$(descriptionColumn)
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

    async clickWhenRadioButton(i) {
        await page.waitForSelector(whenRadioButtons, { timeout: 2000 })
        const btn = await page.$$(whenRadioButtons)
        await btn[i].click()
    },

    async selectRuleByOrder(i) {
        await page.waitForSelector(ruleNumberColumn, {timeout: 2000})
        const ruleList = await page.$$(ruleNumberColumn)
        await ruleList[i].click()
    },

    async uncheckActiveCheckboxByIndex(i = 0) {
        await page.waitForSelector(isActiveColumnCheckboxes, {timeout: 2000})
        const ruleListCheckboxes = await page.$$(isActiveColumnCheckboxes)
        await ruleListCheckboxes[i].click()
        await basicHelper.waitForInputNotValue(isActiveColumnCheckboxes, '✔', i)
    }

}

export const businessRulesModalAssert = {

    async isTitle(text) {
        await page.waitForSelector(dialogTitle, { timeout: 3000 })
        const titleText = await basicHelper.getElementText(dialogTitle)
        expect(titleText).toBe(text)
    },

    async isNewRuleModalOpened() {
        return await basicHelper.isElementVisible(ruleDescriptionInput, 1000)
    },

    async isRulePresentInList(text, length = 30) {
        await page.waitForSelector(descriptionColumn, { timeout: 2000 })
        const records = await page.$$(descriptionColumn)
        let descriptions = []
        for (let i = 0; i < records.length; i++) {
            let description = await basicHelper.getElementText(descriptionColumn, i)
            descriptions[i] = description
        }
        console.log(descriptions)
        expect(descriptions.toString()).toContain(text.substr(0, length))
    },

    async isConditionInputValue(value, i = 0) {
        const actualValue = await basicHelper.getInputValue(ifInputs, i)
        expect(actualValue).toBe(value.toString())
    },

    async isRulesListActiveValue(value, i = 0) {
        const actualValue = await basicHelper.getInputValue(isActiveColumnCheckboxes, i)
        expect(actualValue).toBe(value.toString())
    },

    async isRulesListRuleNumberValue(value, i = 0) {
        const actualValue = await basicHelper.getElementText(ruleNumberColumn, i)
        expect(actualValue).toBe(value.toString())
    },

    async isRulesListActionValue(value, i = 0) {
        const actualValue = await basicHelper.getElementText(actionColumn, i)
        expect(actualValue).toBe(value.toString())
    },

    async isRulesListDetailsValue(value, i = 0, length = 30) {
        const actualValue = await basicHelper.getElementText(detailsColumn, i)
        expect(actualValue.trim().substr(0, length)).toBe(value.substr(0, length))
    },

    async isRulesListConditionValue(value, i = 0) {
        const actualValue = await basicHelper.getElementText(conditionColumn, i)
        expect(actualValue).toBe(value.toString())
    },

    async isConditionInputValue(value, i = 0) {
        await page.waitForSelector(ifInputs, { timeout: 2000, visible: true })
        const actualValue = await basicHelper.getInputValue(ifInputs, i)
        expect(actualValue).toBe(value.toString())
    },
}