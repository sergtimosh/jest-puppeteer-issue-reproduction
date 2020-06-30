import { basicHelper } from "../../helpers/BasicHelper"

const titleTextRows = '[class*="Title-module_component"]'
const titleThirdRow = '.title-third-row'
const cardMessageText = '.card-text'
const disclaimerLinks = '.disclaimer-link'
const errorMessageBlock = '.animated.error-message'
const hints = 'div[class*="Input-module_hintText"]'

export const commonCardAssert = {

    async isTitleRowText(text, i = 0) {
        await page.waitForSelector(titleTextRows)
        const titleRowText = await basicHelper.getElementText(titleTextRows, i)
        expect(titleRowText.trim()).toEqual(text)
    },

    async isThirdTitleText(text) {
        await page.waitForSelector(titleThirdRow)
        const titleRowText = await basicHelper.getElementText(titleThirdRow)
        expect(titleRowText.trim()).toEqual(text)
    },

    async isCardText(text, i = 0) {
        await page.waitForSelector(cardMessageText)
        const titleRowText = await basicHelper.getElementText(cardMessageText, i)
        expect(titleRowText.trim()).toEqual(text)
    },

    async isDisclaimerLinkText(text, i = 0) {
        await page.waitForSelector(disclaimerLinks)
        const buttonText = await basicHelper.getElementText(disclaimerLinks, i)
        expect(buttonText.trim()).toEqual(text)
    },

    async isErrorrMessageText(text) {
        await page.waitForSelector(errorMessageBlock, { timeout: 2000 })
        const message = await basicHelper.getElementText(errorMessageBlock)
        expect(message.trim()).toEqual(text)
    },

    async isHintText(text, i = 0) {
        await page.waitForSelector(hints)
        const hintsText = await page.$$eval(hints, el => {
            return el.map(anchor => anchor.textContent.trim())
        })
        expect(hintsText[i]).toEqual(text)
    }
}