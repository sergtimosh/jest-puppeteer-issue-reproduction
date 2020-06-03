import { basicHelper } from "../../helpers/BasicHelper"

const titleThirdRow = '.title-third-row'
const msOfficeSignIn = '.social-signin-button.office'
const msOfficeSignInText = '.social-signin-button.office .button-text'
const googleSignIn = '.social-signin-button.google'
const googleSignInText = '.social-signin-button.google .button-text'
const commonSignIn = '.bottom-section button[class*="Button-module_primary"]'

export const welcomeCard = {

    async clickGoogleSignIn() {
        await page.waitForSelector(googleSignIn, { timeout: 2000 })
        await page.click(googleSignIn)
    },

    async clickMicrosoftSignIn() {
        await page.waitForSelector(msOfficeSignIn, { timeout: 2000 })
        await page.click(msOfficeSignIn)
    },

    async clickSignInWithYourMail() {
        await page.waitForSelector(commonSignIn, { timeout: 2000 })
        await page.click(commonSignIn)
    }
}

export const welcomeCardAssert = {

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
    }
}