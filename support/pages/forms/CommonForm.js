import { basicHelper } from '../../helpers/BasicHelper'

const breadCrumbs = '.bread-crumb'
const emptyListContainer = '.empty-state-container'
const searchDropdown = '.icon-icon-arrow_drop_down'
const inputSearchIcon = '.innerZoomButton'
const subForms = '.SubFormsPane .SubForm'
const entityTables = '.formTableView_Painted'
const paginationButtons = '.SubFormsPane .ScrollPage'

export const commonForm = {

    //getters
    async getVisibleSubformList() {
        return await page.evaluate((subForms, entityTables) => {
            return [...document.querySelectorAll(subForms)]
                .filter(el => el.closest(entityTables).style.display !== 'none')
                .map(el => el.textContent)
        }, subForms, entityTables)
    },

    async waitForSearchDropdownVisible() {
        await page.waitForSelector(searchDropdown, { timeout: 5000 })
    },

    //actions
    async clickInputSearch() {
        await page.waitForSelector(inputSearchIcon, { visible: true, timeout: 5000 })
        await expect(page).toClick(inputSearchIcon)
    },

    async clickBreadCrumbByText(text) {
        await page.waitForSelector(`${breadCrumbs}:not(:empty)`, { timeout: 5000, visible: true })
        await basicHelper.clickElementByTextContent(breadCrumbs, text)
    },

    async clickLastTabPaginationIcon() {
        await page.waitForSelector(paginationButtons, { timeout: 2000 })
        const buttons = await page.$$(paginationButtons)
        await buttons[buttons.length - 1].click()
    },

    //timeouts
    async waitBreadCrumbHasNoText(text) {
        await basicHelper.waitForElementGoneByText(breadCrumbs, text)
    }
}

export const commonFormAssert = {

    async isBreadCrumbHasText(text, timeout = 10000) {
        await page.waitForSelector(`${breadCrumbs}:not(:empty)`, { timeout: timeout, visible: true })
        await expect(page).toMatchElement(breadCrumbs, { text: text, timeout: timeout })
    },

    async isListEmptyMessage() {
        await page.waitForSelector(`${emptyListContainer}:not(:empty)`, { timeout: 5000, visible: true })
        const text = await page.$eval(emptyListContainer, el => el.textContent)
        expect(text).toMatch('Your list is emptyFind your data by using filters in columns.Add new data by clicking the New buttonNew')
    },
}