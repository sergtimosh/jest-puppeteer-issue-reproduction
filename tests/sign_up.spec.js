import { AUTH_DATA } from "../support/data/auth_data"
import { ELEMENTS_TEXT } from "../support/data/elements_text"
import { ENV_CONFIG } from "../support/data/env_config"
import { browserHelper } from "../support/helpers/BrowserHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { mailHelper } from "../support/helpers/MailHelper"
import { commonCardAssert } from "../support/pages/sections/CommonCard"
import { signInCard, signInCardAssert } from "../support/pages/sections/SignInCard"
import { signUpCard, signUpCardAssert } from "../support/pages/sections/SignUpCard"
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

describe('Sign up', () => {

    test('Sign up', async () => {
        const email = AUTH_DATA.SIGN_UP_MAIL_TEMPLATE
        const password = dataHelper.randPassword()
        const signUpSectionSecondTitle = ELEMENTS_TEXT.SIGN_UP_CARD.SECOND_HEADER
        const from = AUTH_DATA.REGISTRATION_FROM_EMAIL
        const subject = ELEMENTS_TEXT.REGISTRATION_EMAIL.SUBJECT

        //go to sign up card
        await welcomeCard.clickSignInWithYourMail()
        await signInCard.clickSignUpLink()
        await commonCardAssert.isTitleRowText(signUpSectionSecondTitle, 1)
        await signUpCardAssert.isSignUpDisabled()

        //set email and password x 2
        await signUpCard.setEmail(email)
        await signUpCardAssert.isSignUpDisabled()
        await signUpCard.setPassword(password)
        await signUpCardAssert.isSignUpDisabled()
        await signUpCard.setSecondPassword(password)
        await signUpCardAssert.isSignUpEnabled()

        //sign up and verify sign up message
        await signUpCard.clickSignUp()
        await signUpCard.waitForSignUpButtonNotVisible()
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.THANK_YOU_CARD.FIRST_HEADER, 0)
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.THANK_YOU_CARD.SECOND_HEADER, 1)
        await commonCardAssert.isTitleRowText(ELEMENTS_TEXT.THANK_YOU_CARD.THIRD_HEADER, 2)

        //try to sign in without email confirmation
        await Promise.all([
            await page.reload(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        await welcomeCard.clickSignInWithYourMail()
        await signInCard.setEmail(email)
        await signInCard.setPassword(password)
        await signInCard.clickSignIn()
        await signInCardAssert.isErrorrMessageText(ELEMENTS_TEXT.SIGN_IN_CARD.WRONG_CREDENTIALS_MESSAGE)

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
        const conirmationURL = mailHelper.getConfirmationLink(emailBodyHtml) //grab link from email body
        console.log(`cofirmation URL = ${conirmationURL}`)

        //visit confirmation link
        await Promise.all([
            page.goto(conirmationURL, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])

        //assert user can sign in after confirmation
        await welcomeCard.clickSignInWithYourMail()
        await signInCard.setEmail(email)
        await signInCard.setPassword(password)
        await Promise.all([
            await signInCard.clickSignIn(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        //verify URL
        let currentUrl = page.url()
        expect(currentUrl).toEqual(`${URL}/billing`)
    })

    test('Sign up with Same Email Twice', async () => {
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

    test('Password Validation', async () => {
    })

    test('Different Passwords in Two Fields', async () => {
    })

    test('Verify Go Back for Sign up Section', async () => {
    })

    test('Verify Clicking Sign in Link for Sign up Section', async () => {
    })

})

async function clickElementAndWaitForNavigation(selector) {
    const elHandle = await page.waitForSelector(selector, { visible: true, timeout: 5000 })
    await Promise.all([
        await elHandle.click(),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])
}