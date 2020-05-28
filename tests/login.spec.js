import { ENV_CONFIG } from "../support/data/env_config"
import { MODAL_MESSAGES } from "../support/data/modalMessages"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage, loginPageAssert } from "../support/pages/LoginPage"
import { commonModal } from "../support/pages/modals/CommonModal"

const username = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME
const url = ENV_CONFIG.URL
const inv_password = '12345'

beforeAll(async () => {
    await loginPage.navigate(url)
})

describe('Login', () => {

    test('Login with Valid Credentials', async () => {
        await loginPage.fillLoginForm(username, password)
        await commonModal.clickOkBtn()
        await homePageAssert.isSelectedCompany(compName)
    })

    test('Refresh Page After Login', async () => {
        await loginPage.reload()
        await loginPageAssert.isLoginPanelPresent()
    })

    test('Login with Empty Credentials', async () => {
        await loginPage.fillLoginForm('', '')
        await commonModal.clickOkBtn()
        await loginPageAssert.isLoginErrorMessage(MODAL_MESSAGES.LOGIN_ERROR)
    })

    test('Login with Invalid Password', async () => {
        await loginPage.fillLoginForm(username, inv_password)
        await commonModal.clickOkBtn()
        await loginPageAssert.isLoginErrorMessage(MODAL_MESSAGES.LOGIN_ERROR)
    })
})