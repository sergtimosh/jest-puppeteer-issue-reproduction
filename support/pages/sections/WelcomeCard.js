import { basicHelper } from "../../helpers/BasicHelper"

const titleThirdRow = '.title-third-row'
const titleTextRows = '[class*="Title-module_component"]'
const msOfficeSignIn = '.social-signin-button.office'
const msOfficeSignInText = '.social-signin-button.office .button-text'
const googleSignIn = '.social-signin-button.google'
const googleSignInText = '.social-signin-button.google .button-text'
const commonSignIn = '.bottom-section button[class*="Button-module_primary"]'
const disclaimerLinks = 'button.disclaimer-link'

export const welcomeCard = {

    async clickGoogleSignIn() {
        await page.waitForSelector(googleSignIn, { timeout: 2000 })
        await page.click(googleSignIn)
    },

    async clickMicrosoftSignIn() {
        await page.waitForSelector(msOfficeSignIn, { timeout: 2000 })
        await page.click(msOfficeSignIn)
    },
}

export const welcomeCardAssert = {

    async isTitleRowText(text, i = 0) {
        await page.waitForSelector(titleTextRows)
        const titleRowText = await basicHelper.getElementText(titleTextRows, i)
        expect(titleRowText.trim()).toEqual(text)
    },

    async isMicrosoftButtonText(text, i = 0) {
        await page.waitForSelector(msOfficeSignInText)
        const buttonText = await basicHelper.getElementText(msOfficeSignInText, i)
        expect(buttonText.trim()).toEqual(text)
    },

    async isGoogleButtonText(text, i = 0) {
        await page.waitForSelector(googleSignInText)
        const buttonText = await basicHelper.getElementText(googleSignInText, i)
        expect(buttonText.trim()).toEqual(text)
    },

    async isCommonSignButtonText(text, i = 0) {
        await page.waitForSelector(commonSignIn)
        const buttonText = await basicHelper.getElementText(commonSignIn, i)
        expect(buttonText.trim()).toEqual(text)
    },

    async isDisclaimerLinkText(text, i = 0) {
        await page.waitForSelector(disclaimerLinks)
        const buttonText = await basicHelper.getElementText(disclaimerLinks, i)
        expect(buttonText.trim()).toEqual(text)
    }
}