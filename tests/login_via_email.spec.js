import { AUTH_DATA } from "../support/data/auth_data"
import { ELEMENTS_TEXT } from "../support/data/elements_text"
import { ENV_CONFIG } from "../support/data/env_config"
import { browserHelper } from "../support/helpers/BrowserHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { commonCardAssert } from "../support/pages/sections/CommonCard"
import { signInCard, signInCardAssert } from "../support/pages/sections/SignInCard"
import { welcomeCard } from "../support/pages/sections/WelcomeCard"

// jest.retryTimes(0)

const URL = ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE
console.log(`environment url - ${URL}`)

beforeEach(async () => {
    await browserHelper.clearBrowserStorageAndCookies()
    //visit page
    await Promise.all([
        page.goto(URL, { waitUntil: 'domcontentloaded' }),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
    ])
    await welcomeCard.clickSignInWithYourMail()

})

describe('Login via Email', () => {
    const email = AUTH_DATA.EMAIL_LOGIN.EMAIL
    const password = AUTH_DATA.EMAIL_LOGIN.PASSWORD

    test('Login via Email', async () => {
        const secondHeader = ELEMENTS_TEXT.SIGN_IN_CARD.SECOND_HEADER

        //sign in via email
        await commonCardAssert.isTitleRowText(secondHeader, 1)
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

    test('Login with Incorrect Credentials', async () => {
        const randomEmail = dataHelper.randEmail()
        const randomPassword = dataHelper.randPassword()
        const wrongCredentialsMesssage = ELEMENTS_TEXT.SIGN_IN_CARD.WRONG_CREDENTIALS_MESSAGE

        //set valid email and random password
        await signInCard.setEmail(email)
        await signInCard.setPassword(randomPassword)
        await signInCard.clickSignIn()

        //assert err. message
        await signInCardAssert.isErrorrMessageText(wrongCredentialsMesssage)

        //set non-registered email and random password
        await signInCard.setEmail(randomEmail)
        await signInCard.setPassword(randomPassword)
        await signInCard.clickSignIn()

        //assert error message
        await signInCardAssert.isErrorrMessageText(wrongCredentialsMesssage)

        //set valid email and passwor, but change password to upper case
        await signInCard.setEmail(email)
        await signInCard.setPassword(password.toUpperCase())
        await signInCard.clickSignIn()

        //assert error message
        await signInCardAssert.isErrorrMessageText(wrongCredentialsMesssage)

        //perform normal login
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

    test('Verify Unhide Password Icon', async () => {

        //assert password is hidden
        await signInCardAssert.isPasswordHidden()

        //set password and check if it is hidden
        await signInCard.setEmail(email)
        await signInCard.setPassword(password)
        await signInCardAssert.isPasswordHidden()

        //click show password and verify password is visible
        await signInCard.clickShowPassword()
        await signInCardAssert.isPasswordVisible()

        //click hide password and verify password
        await signInCard.clickShowPassword()
        await signInCardAssert.isPasswordHidden()
    })

    test('Verify Refresh Page Action', async () => {
        const firstHeader = ELEMENTS_TEXT.WELCOME_CARD.FIRST_HEADER

        //refresh page and verify redirection to welcome card
        await Promise.all([
            await page.reload(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        await commonCardAssert.isTitleRowText(firstHeader, 0)
        
        //sign in
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

        //reload page and verify url
        await Promise.all([
            await page.reload(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        currentUrl = page.url()
        expect(currentUrl).toEqual(`${URL}/billing`)
    })
})
