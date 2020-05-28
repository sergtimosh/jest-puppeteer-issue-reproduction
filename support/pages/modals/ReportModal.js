import { basicHelper } from '../../helpers/BasicHelper';

const dialogTitle = '.DialogCaption';
const radioButton = 'input[type="radio"]'
const dropdownSelector = 'select.newRepCmb';
const buttons = '.popupBottom [role="button"]';

export const reportModal = {

    async selectRadioButton(text) {
        const button = await page.evaluateHandle((radioButton, text) => {
            return [...document.querySelectorAll(radioButton)]
                .filter(el =>
                    el.nextElementSibling.textContent === text)[0]
        }, radioButton, text)
        let buttonSelected = await this.isSelected(button)
        console.log('RadioBtn Selected: ' + buttonSelected)
        if (!buttonSelected) {
            await button.click()
            buttonSelected = await this.isSelected(button)
        }
        expect(buttonSelected).toBe(true)
    },

    async selectDropdownValue(text) {
        const dropdown = await page.waitForSelector(dropdownSelector, { timeout: 2000 })
        // await dropdown.click(dropdownSelector)
        await basicHelper.selectElementOption(dropdownSelector, text)
    },

    async clickButton(text) {
        await expect(page).toClick(buttons, {
            text: text,
            timeout: 5000
        })
    },

    async isSelected(el) {
        return (await el.getProperty('checked')).jsonValue()
    }

}

export const reportModalAssert = {

    async isTitle(text) {
        await basicHelper.waitForElementSingle(dialogTitle)
        const modalTitle = await page.$eval(dialogTitle, el => el.textContent)
        expect(modalTitle).toBe(text)
    }
}

const listItem = '.listViewerTitleStyle'
const selectedListItem = '.ListViewerItemSelected .listViewerTitleStyle'
const modalTitle = '.popupTopCenterInner .DialogCaption'

export const templateSelectorModal = {

    async selectTemplate(text) {
        await page.waitForSelector(listItem, { timeout: 2000 })
        await basicHelper.clickElementByTextContent(listItem, text)
        await basicHelper.waitForElementHasTextContent(selectedListItem, text)
    },

}

export const templateSelectorModalAssert = {

    async isTitle(text) {
        await page.waitForSelector(modalTitle, { timeout: 2000 })
        const actualTitle = await basicHelper.getElementText(modalTitle)
        expect(actualTitle).toBe(text)
    },

}