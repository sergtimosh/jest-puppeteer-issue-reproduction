import { ENV_CONFIG } from '../support/data/env_config';
import { basicHelper } from '../support/helpers/BasicHelper';
import { commonFormAssert } from '../support/pages/forms/CommonForm';
import { itemizedQuotationSubForm, priceQuotationsForm } from '../support/pages/forms/PriceQuotationsForm';
import { homePage, homePageAssert } from '../support/pages/HomePage';
import { loginPage } from '../support/pages/LoginPage';
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu';
import { mainMenu } from '../support/pages/menus/MainMenu';

const URL = ENV_CONFIG.URL
const user = ENV_CONFIG.USERS.USER_1
const userName = user.NAME
const password = user.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME
const custNumber =ENV_CONFIG.CUSTOMERS.CUSTOMER_1.NUMBER
const partNumber = ENV_CONFIG.PARTS.PART1.NUMBER
const partNumber2 = ENV_CONFIG.PARTS.PART2.NUMBER
const quantity = 10
const quantity2 = 12
const price = 100
const price2 = 200

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetBrowser()
    await loginPage.login(URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 10)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Price Quotations', () => {

    test('Offer Price Quotations for Customers', async () => {
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Price Quotations')
        await mainMenu.selectTabForm('Price Quotations for Customers')
        await commonFormAssert.isBreadCrumbHasText('Price Quotations for Customers')
        await commonFormMenu.switchToTableRecordView()

        await priceQuotationsForm.setCustomersNumber(custNumber)
        await itemizedQuotationSubForm.clickTab()
        await commonFormAssert.isBreadCrumbHasText('Itemized Quotation')
        await commonFormMenu.switchToMultiRecordView()
        await itemizedQuotationSubForm.setPartNumber(partNumber)
        await itemizedQuotationSubForm.setQuantity(quantity)
        await itemizedQuotationSubForm.setPrice(price)
        await itemizedQuotationSubForm.setPartNumber(partNumber2, 1)
        await itemizedQuotationSubForm.setQuantity(quantity2, 1)
        await itemizedQuotationSubForm.setPrice(price2, 1)

        await priceQuotationsForm.setStatusInput('Ready')
        await commonFormMenu.clickMenuButton('Open Order')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        await homePage.clickFooterMenuTab('Active Screens')
        await homePage.selectItemFromActiveScreensList('Price Quotations for Customers - ' + compName)
        await homePageAssert.isLatestUpdateListHidden()

        await mainMenu.clickHamburgerMenu()
        await mainMenu.clickHamburgerRun()
        await mainMenu.clickHamburgerRefresh()

        await priceQuotationsForm.waitForStatusToChangeFrom('Ready')
        const newStatus = await priceQuotationsForm.getStatus()
        expect(newStatus).toBe('Order Placed')
    })
})