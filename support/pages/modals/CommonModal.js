// import { executablePath } from "puppeteer"

import { basicHelper } from "../../helpers/BasicHelper"

const dialogContent = '.rc-dialog-content'
const dialogTitle = '.rc-dialog-title'
const dialogBody = '.rc-dialog-body'
const attentionIcon = '.icon-icon-attention'
const modalCaption = '#PriModalDialog .Caption'
const commonOkButton = '.InlineManual_OKButton'
const commonCancelButton = '.InlineManual_CancelButton'

export const commonModal = {

    //timeouts
    async waitForAttentionModal() {
        await page.waitForSelector(attentionIcon, { timeout: 5000 })
    },

    async waitForModalNotVisible() {
        await basicHelper.waitForElementGone(dialogContent)
    },

    async waitForModalVisible() {
        await page.waitForSelector(modalCaption, { timeout: 5000 })
    },

    async waitForModalNotVisible() {
await basicHelper.waitForElementGone(modalCaption,)
    },

    //actions
    async removeErrorMessage() {
        const visibility = await basicHelper.isElementVisible(dialogTitle, 2000)
        if (visibility) {
            console.log(`err popup present - ${visibility}`)
            await page.click('#reactModalBtns button')
            await page.waitFor(2000)
        }
        // const isPopupPresent = await page.evaluate(() => {
        //     return document.querySelector('.rc-dialog-title label').textContent.includes('is already connected to the system')
        // }).catch(() => console.log('no error dialog'))
        // if (isPopupPresent) {
        //     console.log(`err popup present - ${isPopupPresent}`)
        //     await page.click('#reactModalBtns button')
        //     await page.waitFor(2000)
        // }
    },

    async clickOkBtn() {
        await expect(page).toClick('button', { text: 'OK', timeout: 5000 })
    },

    async clickNoBtn() {
        await expect(page).toClick('button', { text: 'No', timeout: 5000 })
    },

    async clickYesBtn() {
        await expect(page).toClick('button', { text: 'Yes', timeout: 5000 })
    },

    async clickBtnByText(text) {
        await expect(page).toClick('button', { text: text, timeout: 5000 })
    },

    async clickCommonOkButton() {
        await page.waitForSelector(commonOkButton, {timeout: 2000})
        await page.click(commonOkButton)
    },

    async clickCommonCancelButton() {
        await page.waitForSelector(commonCancelButton, {timeout: 2000})
        await page.click(commonCancelButton)
    }
}

export const commonModalAssert = {

    async isTitleText(text, timeout = 5000) {
        await page.waitForSelector(dialogContent, { timeout: timeout })
        const message = await page.$eval(dialogTitle, el => el.textContent)
        expect(message.trim()).toBe(text)
    },

    async isBodyText(text, timeout = 5000) {
        await page.waitForSelector(dialogContent, { timeout: timeout })
        const message = await page.$eval(dialogBody, el => el.textContent)
        expect(message.trim()).toBe(text)
    }
}