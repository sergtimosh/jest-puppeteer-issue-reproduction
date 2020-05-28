import { basicHelper } from "../../helpers/BasicHelper"

const displayTile = '[data-testid="Display"]'
const emailTile = '[data-testid="Email"]'
const printTile = '[data-testid="Print"]'
const printSystemFileSelector = '.print-system-file'
const printWordFileSelector = '.print-word-file'
const selectedSelector = '.print-source-selected'
const additionalOptions = '.print-more-options-label'
const additionalOptionsExpanded = '.print-more-options-label.print-more-options-visible'
const checkBox = 'input[type="checkbox"]'
const dropDownIcon = '.rc-dialog-content .icon-icon-arrow_drop_down'
const dropdownItems = '.scroll-area span'
const dropdown = 'input[value]'
const footerButtons = '.rc-dialog-footer button'

export const orderConfirmationPopup = {

    async selectDisplayTile() {
        await page.waitForSelector(displayTile, { timeout: 5000 })
        await page.click(displayTile)
    },

    async selectEmailTile() {
        await page.waitForSelector(emailTile, { timeout: 5000 })
        await page.click(emailTile)
    },

    async selectPrintTile() {
        await page.waitForSelector(printTile, { timeout: 5000 })
        await page.click(printTile)
    },

    async confirm() {
        await page.waitForSelector(footerButtons, { timeout: 2000 })
        await basicHelper.clickElementByTextContent(footerButtons, 'Apply')
    },

    async clickDropdownIcon() {
        await page.waitForSelector(dropDownIcon, { timeout: 5000 })
        await page.click(dropDownIcon)
    },

    async selectDropdownValue(text) {
        await page.waitForSelector(dropdownItems, { timeout: 2000 })
        await basicHelper.clickElementByTextContent(dropdownItems, text)
        const selectedValue = await basicHelper.getInputValue(dropdown)
        expect(selectedValue).toBe(text)
    },

    async switchToSystemDocument() {
        const selector = await basicHelper
            .raceSelectors([printSystemFileSelector + selectedSelector, printWordFileSelector + selectedSelector])
        if (selector === printWordFileSelector + selectedSelector) {
            await page.click(printSystemFileSelector)
            await page.waitForSelector(printSystemFileSelector + selectedSelector, { visible: true, timeout: 5000 })
        }
    },

    async switchToWordDocument() {
        const selector = await basicHelper
            .raceSelectors([printSystemFileSelector + selectedSelector, printWordFileSelector + selectedSelector])
        if (selector === printSystemFileSelector + selectedSelector) {
            await page.click(printWordFileSelector)
            await page.waitForSelector(printWordFileSelector + selectedSelector, { visible: true, timeout: 5000 })
        }
    },

    async expandAdditionalOptions() {
        const optionsHandle = await page.waitForSelector(additionalOptions, { visible: true, timeout: 2000 })
        await optionsHandle.click()
        await page.waitForSelector(additionalOptionsExpanded, { visible: true, timeout: 2000 })
    },

    async checkOption(text) {
        const button = await page.evaluateHandle((checkBox, text) => {
            return [...document.querySelectorAll(checkBox)]
                .filter(el =>
                    el.nextElementSibling.nextElementSibling.textContent.trim() === text)[0]
        }, checkBox, text)
        let checkBoxChecked = await this.isSelected(button)
        console.log('Checkbox Checked: ' + checkBoxChecked)
        if (!checkBoxChecked) {
            await page.evaluateHandle(button => button.nextElementSibling.click(), button)
            checkBoxChecked = await this.isSelected(button)
        }
        expect(checkBoxChecked).toBe(true)
    },

    async uncheckOption(text) {
        const button = await page.evaluateHandle((checkBox, text) => {
            return [...document.querySelectorAll(checkBox)]
                .filter(el =>
                    el.nextElementSibling.nextElementSibling.textContent.trim() === text)[0]
        }, checkBox, text)
        let checkBoxChecked = await this.isSelected(button)
        console.log('Checkbox Checked: ' + checkBoxChecked)
        if (checkBoxChecked) {
            await page.evaluateHandle(button => button.nextElementSibling.click(), button)
            checkBoxChecked = await this.isSelected(button)
        }
        expect(checkBoxChecked).toBe(false)
    },

    async isSelected(el) {
        return (await el.getProperty('checked')).jsonValue()
    }
}