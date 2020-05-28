import { basicHelper } from "../helpers/BasicHelper";

const homePageWrapper = 'main.wrapper'
const companiesList = '.inlineManual_chooseItem div';
const dialogTitle = '#PriModalDialog .DialogCaption'
const companySelector = '#PriModalDialog .choosecompanydlg_textBoxStyle'
const companiesPanel = '.inlineManual_choosePanel'
const popupBtns = 'div[role="button"]'
const popupDropdown = '.priModalDialog .choosecompanydlg_textBoxStyle'
const companyButton = '#companyName'
const footerMenuTabs = '.pop-menu-tabs .menu-tab'
const latestUpdatestList = '.last-updates .content'
const latestUpdatesListTitles = '.last-updates .content .title'
const activeScreensListTitles = '.active-screens .content .title'
const openedWindowsIcon = '.openedWindowsNumber'
const tilesText = '.subjectsMenuItem a'

export const homePage = {

    async selectCompany(text) {
        await page.waitForSelector(dialogTitle, { visible: true, timeout: 10000 })
        // await expect(page).toMatchElement(dialogTitle, { text: 'Select Company', timeout: 10000 })
        await basicHelper.waitForElementHasTextContent(dialogTitle, 'Select Company')
        await basicHelper.waitForNetworkIdle(500, { optPage: page }) //This wait should be removed by some implicit wait condition
        await page.click(companySelector)
        await page.waitForSelector(companiesPanel)
        await expect(page).toClick(companiesList, { text: text })
    },

    async submitCompanyPopup() {
        await page.waitForSelector(popupBtns)
        await basicHelper.clickElementByTextContent(popupBtns, 'OK')
        // await expect(page).toClick(popupBtns, { text: 'OK' })
    },

    async clickFooterMenuTab(text) {
        await page.waitForSelector(footerMenuTabs)
        await expect(page).toClick(footerMenuTabs, { text: text })
    },

    async clickTopLatestUpdateListElement(i) {
        await page.waitForSelector(latestUpdatestList)
        const listElements = await page.$$(latestUpdatestList)
        await listElements[i].click()
    },

    async selectItemFromLatestUpdatesList(text) {
        await page.waitForSelector(latestUpdatesListTitles)
        const listItemText = new RegExp("Sales Order " + text)
        await expect(page).toMatch(listItemText, { timeout: 3000 })
        await expect(page).toClick(latestUpdatesListTitles, { text: listItemText, timeout: 5000 })
    },

    async selectItemFromActiveScreensList(text) {
        await page.waitForSelector(activeScreensListTitles)
        await expect(page).toMatch(text, { timeout: 3000 })
        await expect(page).toClick(activeScreensListTitles, { text: text, timeout: 5000 })
    },

    async clickTile(text) {
        let startTime = Date.now()
        do {
            await basicHelper.clickElementByTextContent(tilesText, text)
        } while (
            !(await basicHelper.isElementDisplayedByClass(homePageWrapper, 5000))
            && Date.now() - startTime < 8000)
    },

    async waitForHomePage() {
        await page.waitFor((homePageWrapper) =>
            !document.querySelector(homePageWrapper + '.displayNone'),
            { timeout: 3000 },
            homePageWrapper)
    },

    async clickCompanyButton() {
        await page.waitForSelector(`${companyButton}:not(:empty)`, { timeout: 10000 })
        await page.click(companyButton, { timeout: 10000 })
        await basicHelper.waitForElementHasTextContent(dialogTitle, 'Select Company')
        await page.waitForSelector(dialogTitle, { timeout: 3000 })
        const title = await basicHelper.getElementText(dialogTitle)
        expect(title).toBe('Select Company')
    },

    async clickCompanySelector() {
        await page.waitForSelector(companySelector, { timeout: 2000 })
        await page.click(companySelector)
        await page.waitForSelector(companiesPanel)
    },

    async selectCompanyFromList(text) {
        await page.waitForSelector(companiesList)
        await basicHelper.clickElementByTextContent(companiesList, text)
    },
}

export const homePageAssert = {

    async isSelectedCompanyInPopup(text) {
        const selectedCompany = await page.$eval(popupDropdown, el => el.textContent)
        expect(selectedCompany).toBe(text)
    },

    async isSelectedCompany(text, timeout = 20000) {
        await page.waitForSelector(`${companyButton}:not(:empty)`, { timeout: timeout })
        const companyName = await page.$eval(companyButton, el => el.textContent)
        expect(companyName).toBe(text)
    },

    async isUpdatesListContainsText(text) {
        await page.waitForSelector(latestUpdatestList)
        const listElementText = await page.$$eval(latestUpdatestList, list => list.map(el => el.textContent))
        expect(listElementText.toString()).toContain(text)
    },

    async isCompaniesListContainsCompany(text) {
        await page.waitForSelector(companiesList)
        const listElementText = await page.$$eval(companiesList, list => list.map(el => el.textContent))
        expect(listElementText.toString()).toContain(text)
    },

    async isOpenedWindowsNumber(number) {
        await basicHelper.waitForElementHasTextContent(openedWindowsIcon, number.toString())
        const actualNumber = await basicHelper.getElementText(openedWindowsIcon)
        expect(actualNumber).toBe(number.toString())
    },

    async isLatestUpdateListHidden() {
        await page.waitForSelector(latestUpdatestList, { hidden: true })
    },

    async isCompanyPresentInSelectionList() {
        await page.waitForSelector(companiesPanel)
    }
}