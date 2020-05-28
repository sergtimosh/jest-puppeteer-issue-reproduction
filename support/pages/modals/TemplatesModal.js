import { basicHelper } from "../../helpers/BasicHelper"

const dialogCaption = '.DialogCaption'
const nameInput = '.templateEditorBottomstyle input'
const newButton = '.gwt-PushButton-up'
const importIcon = (templateName) => `//div[contains(text(), "${templateName}")]/parent::td//following-sibling::td//div//img[contains(@title,"Import")]`
const deleteIcon = 'img[title="Delete"]'
const attachFileHiddenInput = 'input[accept=".xlsx"]'

export const templatesModal = {

    //setters
    async setName(text) {
        await page.waitForSelector(nameInput, { timeout: 2000 })
        await page.type(nameInput, text)
    },

    //timeouts
    async waitForRecordsCountToBe(n) {
        await basicHelper.waitForElementsCount(deleteIcon, n, 2000)
    },

    //actions
    async clickNew() {
        await page.waitForSelector(newButton, { timeout: 2000 })
        await page.click(newButton)
    },

    async clickImportByTemplateName(name) {
        await page.waitForXPath(importIcon(name), { timeout: 5000 })
        const elHandles = await page.$x(importIcon(name))
        await elHandles[0].click()
    },

    async triggerUpload(i = 0) {
        const uploadHandle = (await page.$$(attachFileHiddenInput))[i]
        await uploadHandle.evaluate(upload => upload.dispatchEvent(new Event('change', { bubbles: true }))) //manually trigger event
    },

    async countTemplates() {
        let templatesNumber
        await page.waitForSelector(deleteIcon, { timeout: 2000 })
            .catch(() => templatesNumber = 0)
        const templates = await page.$$(deleteIcon)
        templatesNumber = templates.length
        return templatesNumber
    },

    async deleteNRecords(n, remaining = 0) {
        for (let i = 0; i < n; i++) {
            await page.click(deleteIcon)
            await this.waitForRecordsCountToBe(n - 1 - i + remaining)
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

export const templatesModalAssert = {

    async isTitleText(text, timeout = 5000) {
        await page.waitForSelector(dialogCaption, { timeout: timeout })
        const message = await page.$eval(dialogCaption, el => el.textContent)
        expect(message.trim()).toBe(text)
    }
}