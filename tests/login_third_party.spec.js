import { AUTH_DATA } from "../support/data/auth_data"
import { ELEMENTS_TEXT } from "../support/data/elements_text"
import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { browserHelper } from "../support/helpers/BrowserHelper"
import { commonCardAssert } from "../support/pages/sections/CommonCard"
import { signInCard } from "../support/pages/sections/SignInCard"
import { welcomeCard, welcomeCardAssert } from "../support/pages/sections/WelcomeCard"

// jest.retryTimes(0)

const URL = ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE

beforeEach(async () => {
    await browserHelper.clearBrowserStorageAndCookies()
    //visit page
    await Promise.all([
        page.goto(URL, { waitUntil: 'domcontentloaded' }),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
    ])

})

describe('Login via Third Party Auth Services', () => {

    test('Verify Welcome Card', async () => {
        //headers
        const firstHeader = ELEMENTS_TEXT.WELCOME_CARD.FIRST_HEADER
        const thirdHeader = ELEMENTS_TEXT.WELCOME_CARD.THIRD_HEADER
        const sectionDivider = ELEMENTS_TEXT.WELCOME_CARD.SECTION_DIVIDER
        //buttons
        const microsoftButtonText = ELEMENTS_TEXT.WELCOME_CARD.MICROSOFT_BUTTON
        const googleButtonText = ELEMENTS_TEXT.WELCOME_CARD.GOOGLE_BUTTON
        const commonSignInText = ELEMENTS_TEXT.WELCOME_CARD.COMMON_SIGN_BUTTON
        //disclaimer links
        const termsLinkText = ELEMENTS_TEXT.WELCOME_CARD.DISCLAIMER_TERMS_LINK
        const privacyLinkText = ELEMENTS_TEXT.WELCOME_CARD.DISCLAIMER_PRIVACY_LINK

        //assert title text
        await commonCardAssert.isTitleRowText(firstHeader, 0)
        await commonCardAssert.isThirdTitleText(thirdHeader)
        await commonCardAssert.isTitleRowText(sectionDivider, 2)

        //assert  button text
        await welcomeCardAssert.isMicrosoftButtonText(microsoftButtonText)
        await welcomeCardAssert.isGoogleButtonText(googleButtonText)
        await welcomeCardAssert.isCommonSignButtonText(commonSignInText)

        //assert disclaimer links
        await commonCardAssert.isDisclaimerLinkText(termsLinkText, 0)
        await commonCardAssert.isDisclaimerLinkText(privacyLinkText, 1)
    })

    test('Login via Google', async () => {
        const googleEmail = AUTH_DATA.GMAIL_LOGIN.EMAIL
        const googlePassword = AUTH_DATA.GMAIL_LOGIN.PASSWORD

        //sign in via Google
        await Promise.all([
            welcomeCard.clickGoogleSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])
        const selector = await basicHelper.raceSelectors(['input#Email', 'input[type="email"]'])
        const emailInput = await page.waitForSelector(selector, { visible: true, timeout: 5000 })
        await emailInput.type(googleEmail)
        await page.waitFor(500)
        const buttonNextSelector = await basicHelper.raceSelectors(['#identifierNext:not([disabled])', '#next:not([disabled])'])
        await clickElementAndWaitForNavigation(buttonNextSelector)
        const passwordInput = await page.waitForSelector('input[type="password"]', { visible: true, timeout: 5000 })
        await passwordInput.type(googlePassword)
        const submitSelector = await basicHelper.raceSelectors(['#identifierNext:not([disabled])', '#submit:not([disabled]'])
        await clickElementAndWaitForNavigation(submitSelector)
        await basicHelper.waitForNetworkIdle({ timeout: 600 })
        const currentUrl = page.url()
        expect(currentUrl).toBe(`${URL}/billing`)
    })

    test('Login via Microsoft 365', async () => {
        const microsoftLogin = AUTH_DATA.MICROSOFT_LOGIN.EMAIL
        const microsoftPassword = AUTH_DATA.MICROSOFT_LOGIN.PASSWORD

        //sign in via MS 365
        await Promise.all([
            welcomeCard.clickMicrosoftSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        const emailInput = await page.waitForSelector('input[type="email"]', { visible: true, timeout: 5000 })
        await emailInput.type(microsoftLogin)
        await clickElementAndWaitForNavigation('input[type="submit"]')
        const passwordInput = await page.waitForSelector('input[type="password"]:not([aria-hidden="true"])', { visible: true, timeout: 5000 })
        await passwordInput.type(microsoftPassword)
        await clickElementAndWaitForNavigation('input[type="submit"]')

        //dissmiss saving login data
        await clickElementAndWaitForNavigation('#idBtn_Back')

        //verify URL
        await basicHelper.waitForNetworkIdle({ timeout: 600 })
        const currentUrl = page.url()
        expect(currentUrl).toEqual(`${URL}/billing`)
    })

    test('Verify Returning Back to Auth Selection', async () => {
        const email = AUTH_DATA.EMAIL_LOGIN.EMAIL
        const password = AUTH_DATA.EMAIL_LOGIN.PASSWORD

        //visit Microsoft sign in card
        await Promise.all([
            welcomeCard.clickMicrosoftSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        let currentUrl = page.url()
        expect(currentUrl).toContain('login.microsoftonline.com')

        //go back
        await page.goBack() //for Back button in microsoft UI
        await page.goBack() //for browser back arrow

        //visit Google sign in card
        await Promise.all([
            welcomeCard.clickGoogleSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        currentUrl = page.url()
        expect(currentUrl).toContain('google.com')

        //go back
        await page.goBack()

        //sign in via email
        await welcomeCard.clickSignInWithYourMail()
        await signInCard.setEmail(email)
        await signInCard.setPassword(password)
        await Promise.all([
            await signInCard.clickSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        //verify URL
        currentUrl = page.url()
        expect(currentUrl).toEqual(`${URL}/billing`)

    })

})

async function clickElementAndWaitForNavigation(selector) {
    const elHandle = await page.waitForSelector(selector, { visible: true, timeout: 5000 })
    await Promise.all([
        await elHandle.click(),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])
}