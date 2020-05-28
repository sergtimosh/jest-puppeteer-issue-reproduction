import { basicHelper } from "../../helpers/BasicHelper"

const title = '.gr-panel .title'
const menuTabs = '.menu .menu-tab'
const selectedMenuTab = '.menu .menu-tab.selected'
const searchField = '.gr-panel .search-input'
const searchResults = '.search-options .option'
const selectedFieldTitle = '.field.selected span[title]'
const tabField = '.field.tab'
const expandedTab = '.field.tab.expanded'
const activeTab = '.field.tab.active'
const expandedFields = '.tab-fields.expanded .field'
const activeFieldsMoreIcon = '.field.selected .more-sign'
const hiddenFieldsMoreIcon = '.field.hidden .more-sign'
const expandedFieldTitlesWithoutHidden = '.tab-fields.expanded .field:not(.hidden) span'
const downArrow = '.actions .movement [alt="Move down"]'
const upArrow = '.actions .movement [alt="Move up"]'
const moveToTopArrow = '.actions .movement [alt="Move to top"]'
const saveButton = '.confirm-btn'
const restoreDefaultsButton = '.defaults-btn'
const fieldActions = '.field-actions .action-tab'
const disabledFieldActions = '.action-tab.disabled'
const activeInput = '.approved-input input'
const hideRadioButtons = '.ui.radio.checkbox'
const moveOptions = '.action-details .move-option'
const selectedMoveOption = '.action-details .move-option.selected'
const newTabButton = '.new-tab-btn'
const closeSliderButton = '.panel-button'
const fieldsOpenedList = '.field:not(.hidden)' //only visible fields
const hiddenMultirecordFieldTitles = '.field.hidden span[title]' //only hidden fields
const hiddenMultirecordFields = '.field.hidden' //only hidden fields
const selectedFieldMultirecord = '.field.selected' //selected field
const pinnedFieldIcon = 'img.pin-img'

export const formDesignPanel = {

    //setters
    async setIntoSearchField(text) {
        const elHandle = await page.waitForSelector(searchField, { timeout: 2000 })
        await elHandle.type(text)
        const actualValue = await basicHelper.getInputValue(searchField)
        expect(actualValue).toBe(text)
    },

    async setTabName(text) {
        await page.waitForSelector(activeInput, { timeout: 2000 })
        await page.type(activeInput, text)
        const newValue = await basicHelper.getInputValue(activeInput)
        expect(newValue).toEqual(text)
    },

    //getters
    async getFieldsOrder() {
        return await basicHelper.getElementsTextArray(expandedFieldTitlesWithoutHidden)
    },

    async getVisibleMultirecordFieldsArray() {
        return await basicHelper.getElementsTextArray(fieldsOpenedList)
    },

    async getHiddenMultirecordFieldsArray() {
        return await basicHelper.getElementsTextArray(hiddenMultirecordFieldTitles)
    },

    async getDisabledOptionsArray() {
        return await basicHelper.getElementsTextArray(disabledFieldActions)
    },

    async getPinnedOptionText() {
        return await page.evaluate((fieldsMultirecord, pinnedFieldIcon) => {
            return [...document.querySelectorAll(fieldsMultirecord)]
                .filter(el => el.querySelector(pinnedFieldIcon))
                .map(el => el.textContent)[0]
        }, fieldsOpenedList, pinnedFieldIcon)
    },

    //timeouts
    async waitForSearchResult(text) {
        await page.waitForSelector(searchResults, { timeout: 2000 })
        await basicHelper.waitForElementHasTextContent(searchResults, text)
    },

    async waitForTabToBeExpanded(text) {
        await page.waitForSelector(expandedTab, { timeout: 2000 })
        await basicHelper.clickElementByTextContent()
    },

    async waitSliderIsGone() {
        await basicHelper.waitForElementGone(title)
    },

    //actions
    async clickSearchResult(text) {
        await page.waitForSelector(searchResults, { timeout: 2000 })
        await basicHelper.clickElementByTextContent(searchResults, text)
    },

    async selectTab(text) {
        await page.waitForSelector(tabField, { timeout: 2000 })
        await basicHelper.waitForElementHasTextContent(tabField, text)
        await basicHelper.clickElementByTextContent(tabField, text)
    },

    async selectField(text) {
        await page.waitForSelector(expandedFields, { timeout: 2000 })
        await basicHelper.clickElementByInnerText(expandedFields, text)
        const selectedFieldText = await basicHelper.getElementInnerText(selectedFieldTitle)
        expect(selectedFieldText).toBe(text)
    },

    async selectMenuTab(text) {
        await page.waitForSelector(menuTabs, { timeout: 2000 })
        await basicHelper.clickElementByInnerText(menuTabs, text)
        const actualSelectedMenuTab = await basicHelper.getElementInnerText(selectedMenuTab)
        expect(actualSelectedMenuTab).toBe(text)
    },

    async selectFieldMultirecordByIndex(i) {
        await page.waitForSelector(fieldsOpenedList, { timeout: 2000 })
        const fields = await page.$$(fieldsOpenedList)
        const fieldText = await basicHelper.getElementInnerText(fieldsOpenedList, i)
        await fields[i].click()
        const selectedFieldText = await basicHelper.getElementInnerText(selectedFieldMultirecord)
        expect(selectedFieldText).toBe(fieldText)
    },

    async selectFieldMultirecordByText(text) {
        await page.waitForSelector(fieldsOpenedList, { timeout: 2000 })
        await basicHelper.clickElementByInnerText(fieldsOpenedList, text)
        const selectedFieldText = await basicHelper.getElementInnerText(selectedFieldMultirecord)
        expect(selectedFieldText).toBe(text)
    },

    async clickMoveDown() {
        await page.waitForSelector(downArrow, { timeout: 2000 })
        await page.click(downArrow)
    },

    async clickMoveUp() {
        await page.waitForSelector(upArrow, { timeout: 2000 })
        await page.click(upArrow)
    },

    async clickMoveToTop() {
        await page.waitForSelector(moveToTopArrow, { timeout: 2000 })
        await page.click(moveToTopArrow)
    },

    async clickSaveButton() {
        await page.waitForSelector(saveButton, { timeout: 2000 })
        await page.click(saveButton)
    },

    async clickRestoreDefaultsButton() {
        await page.waitForSelector(restoreDefaultsButton, { timeout: 2000 })
        await page.click(restoreDefaultsButton)
    },

    async clickMoreIcon() {
        await page.waitForSelector(activeFieldsMoreIcon, { timeout: 2000 })
        await page.click(activeFieldsMoreIcon)
    },

    async clickMoreIconForHiddenField(text) {
        await page.waitForSelector(hiddenFieldsMoreIcon, { timeout: 2000 })
        await page.$eval(hiddenFieldsMoreIcon, el => el.scrollIntoView())
        await basicHelper.waitForNetworkIdle(400)
        const moreButton = await page.evaluateHandle((text, hiddenFieldsMoreIcon, hiddenMultirecordFields) => {
            return [...document.querySelectorAll(hiddenFieldsMoreIcon)]
                .filter(el => el
                    .closest(hiddenMultirecordFields)
                    .innerText === text)[0]
        }, text, hiddenFieldsMoreIcon, hiddenMultirecordFields)
        await moreButton.click()
    },

    async clickMoreIconForSingleHiddenField() {
        await page.waitForSelector(hiddenFieldsMoreIcon, { timeout: 2000 })
        await page.$eval(hiddenFieldsMoreIcon, el => el.scrollIntoView())
        await basicHelper.waitForNetworkIdle(400)
        await page.click(hiddenFieldsMoreIcon)
        // const moreButton = await page.evaluateHandle((text, hiddenFieldsMoreIcon, hiddenMultirecordFields) => {
        //     return [...document.querySelectorAll(hiddenFieldsMoreIcon)]
        //         .filter(el => el
        //             .closest(hiddenMultirecordFields)
        //             .innerText === text)[0]
        // }, text, hiddenFieldsMoreIcon, hiddenMultirecordFields)
    },

    async clickFieldAction(text) {
        await page.waitForSelector(fieldActions, { timeout: 2000 })
        await basicHelper.clickElementByTextContent(fieldActions, text)
    },

    async renameField(text) {
        await page.waitForSelector(activeInput, { timeout: 2000 })
        await basicHelper.clear(activeInput)
        await page.type(activeInput, text)
        const newValue = await basicHelper.getInputValue(activeInput)
        expect(newValue).toEqual(text)
    },

    async clickFirstRadioButton() {
        await page.waitForSelector(hideRadioButtons, { timeout: 2000 })
        const radioBtns = await page.$$(hideRadioButtons)
        await radioBtns[0].click()
    },

    async selectColumnToMoveTo(text) {
        await page.waitForSelector(moveOptions, { timeout: 2000 })
        await basicHelper.clickElementByTextContent(moveOptions, text)
        await basicHelper.waitForElementHasTextContent(selectedMoveOption, text)
    },

    async clickNewTabButton() {
        await page.waitForSelector(newTabButton, { timeout: 2000 })
        await page.click(newTabButton)
    },

    async clickCloseSliderButton() {
        await page.waitForSelector(closeSliderButton, { timeout: 2000 })
        await page.click(closeSliderButton)
    },

}

export const formDesignPanelAssert = {

    async isTitle(text) {
        const titleText = await basicHelper.getElementText(title)
        expect(titleText.trim()).toBe(text)
    },

    async isSelectedField(text) {
        await page.waitForSelector(selectedFieldTitle, { timeout: 2000 })
        const actualText = await basicHelper.getElementText(selectedFieldTitle)
        expect(actualText).toBe(text)
    },

    async isActiveTab(text) {
        await page.waitForSelector(activeTab, { timeout: 2000 })
        const actualText = await basicHelper.getElementText(activeTab)
        expect(actualText).toBe(text)
    }
}