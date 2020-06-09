import { AUTH_DATA } from "../support/data/auth_data"
import { ELEMENTS_TEXT } from "../support/data/elements_text"
import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { browserHelper } from "../support/helpers/BrowserHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { mailHelper } from "../support/helpers/MailHelper"
import { commonCardAssert } from "../support/pages/sections/CommonCard"
import { forgotPasswordCard, forgotPasswordCardAssert } from "../support/pages/sections/ForgotPasswordCard"
import { signInCard } from "../support/pages/sections/SignInCard"
import { signUpCard } from "../support/pages/sections/SignUpCard"
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

    test.only('Reset Password', async () => {
        jest.setTimeout(40000)
        const email = AUTH_DATA.RESET_PASS_EMAIL
        const password = dataHelper.randPassword()
        const from = AUTH_DATA.REGISTRATION_FROM_EMAIL
        const subject = ELEMENTS_TEXT.RESET_PASWORD_EMAIL.SUBJECT
        const secondHeader = ELEMENTS_TEXT.SIGN_IN_CARD.SECOND_HEADER

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

        //verify confirmation message fo reset password action
        await basicHelper.waitForNetworkIdle({ timeout: 250 })
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.FIRST_ROW, 0)
        await commonCardAssert.isTitleRowText(email, 1)
        await commonCardAssert.isCardText(ELEMENTS_TEXT.FORGOT_PASSWORD_CONFIRMATION_CARD.THIRD_ROW)
        //verify mailBox
        let emails = await mailHelper.messageChecker()
        let startTime = Date.now()
        while (emails.length === 0 && Date.now() - startTime < 20000) {
            console.log(`Polling emails received from: ${from}...`)
            await page.waitFor(5000)
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

    test('Verify Cancel for Forgot Password Section', async () => {
        const registeredEmail = AUTH_DATA.EMAIL_LOGIN.EMAIL
        const password = dataHelper.randPassword()
        //go to sign up card
        await welcomeCard.clickSignInWithYourMail()
        await signInCard.clickSignUpLink()

        //set email and password x 2
        await signUpCard.setEmail(registeredEmail)
        await signUpCard.setPassword(password)
        await signUpCard.setSecondPassword(password)

        //try to sign up
        await signUpCard.clickSignUp()
        await commonCardAssert.isErrorrMessageText(ELEMENTS_TEXT.SIGN_UP_CARD.EMAIL_EXIST_MESSAGE)
    })
})