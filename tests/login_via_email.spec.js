import { AUTH_DATA } from "../support/data/auth_data"
import { ELEMENTS_TEXT } from "../support/data/elements_text"
import { ENV_CONFIG } from "../support/data/env_config"
import { browserHelper } from "../support/helpers/BrowserHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { commonCardAssert } from "../support/pages/sections/CommonCard"
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

describe('Login via Email', () => {

    test.only('Login via Email', async () => {
        const email = AUTH_DATA.EMAIL_LOGIN.EMAIL
        const password = AUTH_DATA.EMAIL_LOGIN.PASSWORD
        const secondHeader = ELEMENTS_TEXT.SIGN_IN_CARD.SECOND_HEADER

        //sign in via email
        await welcomeCard.clickSignInWithYourMail()
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
    }, 999999)

    test('Login with Incorrect Credentials', async () => {
        const email = ENV_CONFIG.EMAIL_LOGIN.EMAIL
        const randomEmail = dataHelper.randEmail()
        const password = dataHelper.randPassword()
    })
})

// async function clickElementAndWaitForNavigation(selector) {
//     const elHandle = await page.waitForSelector(selector, { visible: true, timeout: 5000 })
//     await Promise.all([
//         await elHandle.click(),
//         page.waitForNavigation({ waitUntil: 'networkidle0' }),
//     ])
// }