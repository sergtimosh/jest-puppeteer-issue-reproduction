import { ENGLISH_TEXT, HEBREW_TEXT } from "../support/data/elements_text"
import { ENVIRONMENTS } from "../support/data/env_config"
import { browserHelper } from "../support/helpers/BrowserHelper"
import { commonCardAssert } from "../support/pages/sections/CommonCard"
import { forgotPasswordCard } from "../support/pages/sections/ForgotPasswordCard"
import { signInCard } from "../support/pages/sections/SignInCard"
import { signUpCard } from "../support/pages/sections/SignUpCard"
import { welcomeCard, welcomeCardAssert } from "../support/pages/sections/WelcomeCard"

jest.retryTimes(0)

const HEBREW_URL = ENVIRONMENTS.HEBREW
const ENGLISH_URL = ENVIRONMENTS.ENGLISH

beforeEach(async () => {
    await browserHelper.clearBrowserStorageAndCookies()
})

describe('Language Support', () => {

    //there is a bug on step 5
    test('Hebrew Support', async () => {

        //visit Hebrew environment
        await Promise.all([
            page.goto(HEBREW_URL, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
        //welcome card Hebrew text
        const firstWelcomeHeader = HEBREW_TEXT.WELCOME_CARD.FIRST_HEADER
        const commonSignInText = HEBREW_TEXT.WELCOME_CARD.COMMON_SIGN_BUTTON
        const termsLinkText = HEBREW_TEXT.WELCOME_CARD.DISCLAIMER_TERMS_LINK

        //verify welcome page
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)

        //visit Microsoft sign in card and go back
        await Promise.all([
            welcomeCard.clickMicrosoftSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        let currentUrl = page.url()
        expect(currentUrl).toContain('login.microsoftonline.com')
        await page.goBack() //for Back button in microsoft UI
        await page.goBack() //for browser back arrow

        //verify welcome page
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)

        //visit Google sign in card and go back
        await Promise.all([
            welcomeCard.clickGoogleSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        currentUrl = page.url()
        expect(currentUrl).toContain('google.com')
        await page.goBack()

        //verify Welcome page
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)

        //visit Sign in section
        await welcomeCard.clickSignInWithYourMail()
        await commonCardAssert.isTitleRowText(HEBREW_TEXT.SIGN_IN_CARD.SECOND_HEADER, 1)

        //visit Sign up section
        await signInCard.clickSignUpLink()
        await commonCardAssert.isTitleRowText(HEBREW_TEXT.SIGN_UP_CARD.SECOND_HEADER, 1)

        //visit Forgot password section and verify text
        await signUpCard.clickSignInLink()
        await signInCard.clickForgotPasswordLink()
        await commonCardAssert.isTitleRowText(HEBREW_TEXT.FORGOT_PASSWORD_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(HEBREW_TEXT.FORGOT_PASSWORD_CARD.SECOND_ROW, 1)
        await commonCardAssert.isCardText(HEBREW_TEXT.FORGOT_PASSWORD_CARD.CARD_TEXT)

        //go back to welcome card and verify text
        await forgotPasswordCard.clickCancelButton()
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)
    })

    test('English Support', async () => {

        //visit English environment
        await Promise.all([
            page.goto(ENGLISH_URL, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
        //welcome card English text
        const firstWelcomeHeader = ENGLISH_TEXT.WELCOME_CARD.FIRST_HEADER
        const commonSignInText = ENGLISH_TEXT.WELCOME_CARD.COMMON_SIGN_BUTTON
        const termsLinkText = ENGLISH_TEXT.WELCOME_CARD.DISCLAIMER_TERMS_LINK

        //verify welcome page
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)

        //visit Microsoft sign in card and go back
        await Promise.all([
            welcomeCard.clickMicrosoftSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        let currentUrl = page.url()
        expect(currentUrl).toContain('login.microsoftonline.com')
        await page.goBack() //for Back button in microsoft UI
        await page.goBack() //for browser back arrow

        //verify welcome page
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)

        //visit Google sign in card and go back
        await Promise.all([
            welcomeCard.clickGoogleSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        currentUrl = page.url()
        expect(currentUrl).toContain('google.com')
        await page.goBack()

        //verify Welcome page
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)

        //visit Sign in section
        await welcomeCard.clickSignInWithYourMail()
        await commonCardAssert.isTitleRowText(ENGLISH_TEXT.SIGN_IN_CARD.SECOND_HEADER, 1)

        //visit Sign up section
        await signInCard.clickSignUpLink()
        await commonCardAssert.isTitleRowText(ENGLISH_TEXT.SIGN_UP_CARD.SECOND_HEADER, 1)

        //visit Forgot password section and verify text
        await signUpCard.clickSignInLink()
        await signInCard.clickForgotPasswordLink()
        await commonCardAssert.isTitleRowText(ENGLISH_TEXT.FORGOT_PASSWORD_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(ENGLISH_TEXT.FORGOT_PASSWORD_CARD.SECOND_ROW, 1)
        await commonCardAssert.isCardText(ENGLISH_TEXT.FORGOT_PASSWORD_CARD.CARD_TEXT)

        //go back to welcome card and verify text
        await forgotPasswordCard.clickCancelButton()
        await assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText)
    })
})

async function assertWelcomePage(firstWelcomeHeader, commonSignInText, termsLinkText) {
    await commonCardAssert.isTitleRowText(firstWelcomeHeader, 0)
    await welcomeCardAssert.isCommonSignButtonText(commonSignInText)
    await commonCardAssert.isDisclaimerLinkText(termsLinkText, 0)
}