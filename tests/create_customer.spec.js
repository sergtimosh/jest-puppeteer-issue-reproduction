import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { commonForm, commonFormAssert } from "../support/pages/forms/CommonForm"
import { customersForm, customersFormAssertion } from "../support/pages/forms/CustomersForm"
import { homePage, homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { commonFormMenu, commonFormMenuAssert } from "../support/pages/menus/CommonFormMenu"
import { mainMenu } from '../support/pages/menus/MainMenu'
import { commonModal } from "../support/pages/modals/CommonModal"

const custName = 'QA CUSTOMER' + (Math.random() * 1000).toFixed(3)
const user = ENV_CONFIG.USERS.USER_1
const userName = user.NAME
const password = user.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetBrowser()
    await loginPage.login(ENV_CONFIG.URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 10)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Create Customer', () => {

    test('Create New Customer', async () => {
        await mainMenu.selectMainMenuTab('CRM')
        await mainMenu.selectTabMenu('Customers')
        await mainMenu.selectTabForm('Customers')
        await commonFormAssert.isBreadCrumbHasText('Customers')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()
        
        await commonFormMenu.switchToMultiRecordView()
        await commonFormAssert.isListEmptyMessage()
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickNew()

        await commonFormMenuAssert.isExpandedTitle('Add Customer')
        await commonForm.waitForSearchDropdownVisible()
        await customersForm.setCustomerName(custName)
        await commonFormMenu.clickActions()
        await commonFormMenu.clickActionsDropdownMenuItem('Convert Potential Cust to Cust')
        await commonModal.clickOkBtn()
        await commonModal.clickOkBtn()

        const custNumber = await customersForm.getCustomersNumber()
        await customersFormAssertion.isPopupTitleHasText('Customer: ' + custNumber)
        await commonFormMenu.clickBackToList()
        await commonFormAssert.isBreadCrumbHasText('Customers')
        await basicHelper.waitForNetworkIdle(500)
        //await customersFormAssertion.isCustomerNumberInputHasValue(custNumber)
        await commonFormMenu.closeScreen()
        await commonModal.clickOkBtn()
        await homePageAssert.isOpenedWindowsNumber(0)
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        await mainMenu.selectMainMenuTab('CRM')
        await mainMenu.selectTabMenu('Customers')
        await mainMenu.selectTabForm('Customers')
        await commonFormAssert.isBreadCrumbHasText('Customers')
        await commonForm.waitForSearchDropdownVisible()
        await basicHelper.waitForNetworkIdle(500)
        await customersForm.setCustomerNumber(custNumber)
        await page.keyboard.press('Enter')
        const actualName = await customersForm.getCustomersName()
        expect(actualName).toBe(custName)
    })
})