import { basicHelper } from "../../helpers/BasicHelper";

const outerActionsTitle = 'div.button[title="${title}"]'
const outerActions = '.activations-section .button'
const innerActions = '.activations-section .activation-item'
const buttons = '.header-panel button'
const expandedFormTitle = '.popup-title'
const settingsItems = '.buttons-row div'
const actionsItem = (text) => `[title="${text}"]`
const actionsDropDown = '[aria-label="more-dots"]'
const openedDropdown = '.scroll-wrapper'
const chooseBtn = '.choose-box-container'
const backToListLink = '.back-to-list'
const closeFormIcon = '.buttons-row .close-icon'
const singleRecordViewIcon = '.icon-single-record-view'
const tableRecordViewIcon = '.icon-table-view'
const deleteIcon = '.delete-icon'
const settingsIcon = '.icon-icon-settings'
const exportIcon = '.export-icon'

export const commonFormMenu = {

    //getters
    async getOuterActionsArray() {
        await page.waitForSelector(outerActions, { timeout: 2000 })
        return await basicHelper.getElementsTextArray(outerActions)
    },

    async getInnerActionsArray() {
        await page.waitForSelector(innerActions, { timeout: 2000 })
        return await basicHelper.getElementsTextArray(innerActions)
    },

    //actions
    async clickMenuButton(title) {
        await page.waitForSelector(outerActionsTitle.replace('${title}', title))
        await page.click(outerActionsTitle.replace('${title}', title))
    },

    async clickNew() {
        await page.waitForSelector(buttons)
        await expect(page).toClick(buttons, { text: 'New' })
    },

    async clickActions() {
        await page.waitForSelector(actionsDropDown)
        await expect(page).toClick(actionsDropDown)
        await page.waitForSelector(openedDropdown)
    },

    async clickSettingsDropdownMenuItem(text) {
        await page.waitForSelector(settingsItems)
        await basicHelper.clickElementByTextContent(settingsItems, text)
    },

    async clickActionsDropdownMenuItem(text) {
        await page.waitForSelector(actionsItem(text), { timeout: 2000 })
        await page.click(actionsItem(text))
    },

    async clickBackToList() {
        await page.waitForSelector(backToListLink)
        await page.click(backToListLink)
    },

    async closeScreen() {
        await page.waitForSelector(closeFormIcon)
        await page.click(closeFormIcon)
    },

    async clickChooseButton() {
        await page.waitForSelector(chooseBtn)
        await page.click(chooseBtn)
    },

    async switchToMultiRecordView() {
        await basicHelper.waitForNetworkIdle(500)
        const selector = await basicHelper
            .raceSelectors([singleRecordViewIcon, tableRecordViewIcon])
        if (selector === singleRecordViewIcon) {
            await page.click(selector)
            await page.waitForSelector(tableRecordViewIcon, { visible: true, timeout: 5000 })
        }
    },

    async switchToTableRecordView() {
        await basicHelper.waitForNetworkIdle(500)
        const selector = await basicHelper
            .raceSelectors([singleRecordViewIcon, tableRecordViewIcon])
        if (selector === tableRecordViewIcon) {
            await page.click(selector)
            await page.waitForSelector(singleRecordViewIcon, { visible: true, timeout: 5000 })
        }
    },

    async switchToMultiRecordViewNoChangeIcon() {
        await basicHelper.waitForNetworkIdle(500)
        const selector = await basicHelper
            .raceSelectors([singleRecordViewIcon, tableRecordViewIcon])
        if (selector === singleRecordViewIcon) {
            await page.click(selector)
            await basicHelper.waitForNetworkIdle(500)
        }
    },

    async switchToTableRecordViewNoChangeIcon() {
        await basicHelper.waitForNetworkIdle(500)
        const selector = await basicHelper
            .raceSelectors([singleRecordViewIcon, tableRecordViewIcon])
        if (selector === tableRecordViewIcon) {
            await page.click(selector)
            await basicHelper.waitForNetworkIdle(500)
        }
    },

    async clickDeleteIcon() {
        await page.waitForSelector(deleteIcon)
        await page.click(deleteIcon)
    },

    async clickSettingsIcon() {
        await page.waitForSelector(settingsIcon)
        await page.click(settingsIcon)
    },

    async clickExportIcon() {
        await page.waitForSelector(exportIcon)
        await page.click(exportIcon)
    }
}

export const commonFormMenuAssert = {

    async isExpandedTitle(text) {
        await page.waitForSelector(`${expandedFormTitle}:not(:empty)`, { timeout: 5000 })
        const actualText = await page.$eval(expandedFormTitle, el => el.textContent)
        expect(actualText).toMatch(text)
    }
}