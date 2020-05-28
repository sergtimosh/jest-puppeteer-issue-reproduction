import { ENV_CONFIG } from '../support/data/env_config'
import { MODAL_MESSAGES } from '../support/data/modalMessages'
import { basicHelper } from '../support/helpers/BasicHelper'
import { dataHelper } from '../support/helpers/DataHelper'
import { commonFormAssert } from '../support/pages/forms/CommonForm'
import { companiesForm } from '../support/pages/forms/CompaniesForm'
import { homePage, homePageAssert } from '../support/pages/HomePage'
import { loginPage } from '../support/pages/LoginPage'
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu'
import { mainMenu } from '../support/pages/menus/MainMenu'
import { commonModal, commonModalAssert } from '../support/pages/modals/CommonModal'
import { commonParameterInputModal } from '../support/pages/modals/ParameterInputModal'

let faker = require('faker')
const username = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const companyName = ENV_CONFIG.COMPANY_NAME
const URL = ENV_CONFIG.URL

//New Company Data
const newCompanyName = dataHelper.randName('c', 6)
const fullCompanyName = faker.company.companyName()
const fullCompanyNameLang2 = fullCompanyName.toUpperCase()
const country = dataHelper.selectRandomOfArray(['Israel', 'United Kingdom', 'United States'])
const currency = '$'
const secondCurrency = 'EUR'
const vat = dataHelper.selectRandomOfArray(['10', '15', '20', '25'])
console.log(`New Company Name: ${newCompanyName}`)
console.log(`Full Company Name: ${fullCompanyName}`)

jest.retryTimes(0)
jest.setTimeout(300000)

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetBrowser()
})

describe.skip('Creation Company', () => {

    test('Create New Company', async () => {
        //Login
        await loginPage.login(URL, username, password)
        await homePageAssert.isSelectedCompany(companyName)
        //open Parameter Input for New Company
        await page.setViewport({ width: 2014, height: 800 }) //set viewport larger, so Due Date is visible
        await mainMenu.selectMainMenuTab('System Management')
        await mainMenu.selectTabMenu('System Maintenance')
        await mainMenu.selectTabMenu('Companies')
        await mainMenu.selectTabParameterInput('Add Company')
        //Set values
        await commonParameterInputModal.clickClearValues()
        await commonParameterInputModal.setInputValue('Company', newCompanyName)
        await commonParameterInputModal.setInputValue('Full Company Name', fullCompanyName)
        await commonParameterInputModal.setInputValue('Company Name (Lang2)', fullCompanyNameLang2)
        await commonParameterInputModal.setInputValue('Country', country)
        await commonParameterInputModal.setInputValue('Local Currency', currency)
        await commonParameterInputModal.setInputValue('Second Currency', secondCurrency)
        await commonParameterInputModal.setInputValue('VAT (%)', vat)
        await commonParameterInputModal.clickButton('OK')
        //Verify Modal Message and Confirm
        await commonModalAssert.isTitleText('Add Company')
        await commonModalAssert.isBodyText(MODAL_MESSAGES.ADD_COMPANY)
        await commonModal.clickOkBtn()
        //Verify Modal Message and Confirm
        await commonModalAssert.isBodyText(MODAL_MESSAGES.ADD_COMPANY_FINISHED, 150000)
        await commonModal.clickOkBtn()

        //Verify New Company is created and selectable
        await homePage.clickCompanyButton()
        await basicHelper.waitForNetworkIdle(500)
        await homePage.clickCompanySelector()
        await homePageAssert.isCompaniesListContainsCompany(fullCompanyName)
        await homePage.selectCompanyFromList(fullCompanyName)
        // await basicHelper.waitForNetworkIdle(600)
        await homePageAssert.isSelectedCompanyInPopup(fullCompanyName)
        // await basicHelper.waitForNetworkIdle(200)
        await homePage.submitCompanyPopup()
        await homePageAssert.isSelectedCompany(fullCompanyName)

        //Revert Company Selection
        await basicHelper.waitForNetworkIdle(500)
        await homePage.clickCompanyButton()
        await basicHelper.waitForNetworkIdle(500)
        await homePage.clickCompanySelector()
        await homePageAssert.isCompaniesListContainsCompany(companyName)
        await basicHelper.waitForNetworkIdle(600)
        await homePage.selectCompanyFromList(companyName)
        await basicHelper.waitForNetworkIdle(600)
        await homePageAssert.isSelectedCompanyInPopup(companyName)
        await basicHelper.waitForNetworkIdle(200)
        await homePage.submitCompanyPopup()
        await homePageAssert.isSelectedCompany(companyName)
    })

    test('Delete Company', async () => {
        await basicHelper.clearTabs()
        await page.setViewport({ width: 2014, height: 800 })
        await loginPage.login(URL, username, password)
        await homePageAssert.isSelectedCompany(companyName)

        //Select Delete Company Parameter Input
        await mainMenu.selectMainMenuTab('System Management')
        await mainMenu.selectTabMenu('System Maintenance')
        await mainMenu.selectTabMenu('Companies')
        await mainMenu.selectTabParameterInput('Delete Company')
        await commonParameterInputModal.clickClearValues()
        await basicHelper.waitForNetworkIdle(400)
        await commonParameterInputModal.clickSearchIconForInput('Full Company Name')
        //Deactivate Company
        await commonFormAssert.isBreadCrumbHasText('Delete Company')
        await commonFormAssert.isBreadCrumbHasText('Companies')
        await commonFormMenu.switchToTableRecordViewNoChangeIcon()
        await companiesForm.setCompanyNameNotEnter(newCompanyName)
        await page.keyboard.press('Enter')
        const actualFullCompanyName = await companiesForm.getFullCompanyName()
        expect(actualFullCompanyName).toBe(fullCompanyName)
        await companiesForm.unCheckActiveCheckbox()
        await companiesForm.clickCompaniesRemarksTab()
        await commonFormAssert.isBreadCrumbHasText('Companies - Remarks')
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.closeScreen()
        await commonModal.clickOkBtn()
        await basicHelper.waitForNetworkIdle(500)
        await commonParameterInputModal.clickButton('OK')
        await commonModalAssert.isTitleText('Delete Company')
        await commonModalAssert.isBodyText(MODAL_MESSAGES.DELETE_COMPANY_FINISHED)
    })
})