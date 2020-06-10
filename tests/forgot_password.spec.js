import { AUTH_DATA } from "../support/data/auth_data"
import { ELEMENTS_TEXT } from "../support/data/elements_text"
import { ENV_CONFIG } from "../support/data/env_config"
import { TEST_DATA } from "../support/data/test_data.js"
import { basicHelper } from "../support/helpers/BasicHelper"
import { browserHelper } from "../support/helpers/BrowserHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { mailHelper } from "../support/helpers/MailHelper"
import { commonCardAssert } from "../support/pages/sections/CommonCard"
import { forgotPasswordCard, forgotPasswordCardAssert } from "../support/pages/sections/ForgotPasswordCard"
import { signInCard } from "../support/pages/sections/SignInCard"
import { welcomeCard } from "../support/pages/sections/WelcomeCard"

jest.retryTimes(0)

const URL = ENV_CONFIG.URL
console.log(`environment url - ${URL}`)

beforeEach(async () => {
    await browserHelper.clearBrowserStorageAndCookies()
    //visit page
    await Promise.all([
        page.goto(URL, { waitUntil: 'domcontentloaded' }),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
    ])
})

describe('Forgot Password', () => {
    const secondHeader = ELEMENTS_TEXT.SIGN_IN_CARD.SECOND_HEADER

    test.skip('Reset Password', async () => {
        jest.setTimeout(40000)
        const email = AUTH_DATA.RESET_PASS_EMAIL
        const password = dataHelper.randPassword()
        const subject = ELEMENTS_TEXT.RESET_PASWORD_EMAIL.SUBJECT

        //go to sign in with email card
        await welcomeCard.clickSignInWithYourMail()
        await commonCardAssert.isTitleRowText(secondHeader, 1)

        //Click forgot password link
        await signInCard.clickForgotPasswordLink()
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CARD.SECOND_ROW, 1)
        await forgotPasswordCardAssert.isSentResetDisabled() //verify button is disabled

        //set registered email and confirm reset
        await forgotPasswordCard.setEmail(email)
        await forgotPasswordCardAssert.isSentResetEnabled() //verify button is enabled
        await forgotPasswordCard.clickResetPasswordButton()

        //verify confirmation message for reset password action
        await basicHelper.waitForNetworkIdle({ timeout: 250 })
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(email, 1)
        await commonCardAssert.isCardText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.THIRD_ROW)
        //verify mailBox
        let emails = await mailHelper.messageChecker()
        let startTime = Date.now()
        while (emails.length === 0 && Date.now() - startTime < 40000) {
            console.log(`Polling emails on mailbox: ${email}...`)
            await page.waitFor(4000)
            emails = await mailHelper.messageChecker()
        }
        expect(emails.length).toBeGreaterThanOrEqual(1)
        expect(emails[0].subject).toBe(subject)
        const emailBodyHtml = emails[0].body.html
        const resetPasswordURL = mailHelper.getConfirmationLink(emailBodyHtml) //grab link from email body
        console.log(`reset password URL = ${resetPasswordURL}`)

        //visit confirmation link
        await Promise.all([
            page.goto(resetPasswordURL, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
        await jestPuppeteer.debug()
    }, 999999)

    test.skip('Validate Email in Forgot Password Card', async () => {
        const invalidEmails = TEST_DATA.INVALID_EMAILS
        const validEmails = TEST_DATA.VALID_EMAILS
        const email = AUTH_DATA.RESET_PASS_EMAIL

        //go to sign in with email card
        await welcomeCard.clickSignInWithYourMail()
        await commonCardAssert.isTitleRowText(secondHeader, 1)

        //Click forgot password link
        await signInCard.clickForgotPasswordLink()

        //set invalid passwords from array of invalid emails and verify hint message
        for (const invalidEmail of invalidEmails) {
            await forgotPasswordCard.setEmail(invalidEmail)
            await commonCardAssert.isHintText(ELEMENTS_TEXT.CARD_FIELDS_HINTS.INVALID_EMAIL)
            await forgotPasswordCardAssert.isSentResetDisabled()
        }

        //set valid emails and verify  hint message is not displayed
        for (const validEmail of validEmails) {
            await forgotPasswordCard.setEmail(validEmail)
            await commonCardAssert.isHintText('')
            await forgotPasswordCardAssert.isSentResetEnabled()
        }
        
        //set registered email and verify hint message is not displayed
        await forgotPasswordCard.setEmail(email)
        await commonCardAssert.isHintText('')
        await forgotPasswordCardAssert.isSentResetEnabled()
    })
    
    test.only('Click Go Back after Performing Forgot Password Action', async () => {
        jest.setTimeout(40000)
        const email = AUTH_DATA.RESET_PASS_EMAIL

        //go to sign in with email card
        await welcomeCard.clickSignInWithYourMail()
        await commonCardAssert.isTitleRowText(secondHeader, 1)
        
        //go to Forgot Password card, set registered email and confirm reset
        await signInCard.clickForgotPasswordLink()
        await forgotPasswordCard.setEmail(email)
        await forgotPasswordCardAssert.isSentResetEnabled() //verify button is enabled
        await forgotPasswordCard.clickResetPasswordButton()

        //verify confirmation message for reset password action
        await basicHelper.waitForNetworkIdle({ timeout: 250 })
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(email, 1)
        await commonCardAssert.isCardText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.THIRD_ROW)

        //click Go Back link
        await forgotPasswordCard.clickGoBackButton()
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CARD.SECOND_ROW, 1)
        await forgotPasswordCardAssert.isSentResetDisabled()
        await forgotPasswordCardAssert.isEmailFieldValue('')

        //perform reset password again
        await forgotPasswordCard.setEmail(email)
        await forgotPasswordCardAssert.isSentResetEnabled() //verify button is enabled
        await forgotPasswordCard.clickResetPasswordButton()
        await basicHelper.waitForNetworkIdle({ timeout: 250 })
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(email, 1)
        await commonCardAssert.isCardText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.THIRD_ROW)

    })
})