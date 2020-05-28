import { ENV_CONFIG } from '../support/data/env_config'
import { MODAL_MESSAGES } from '../support/data/modalMessages'
import { basicHelper } from '../support/helpers/BasicHelper'
import { dataHelper } from '../support/helpers/DataHelper'
import { commonFormAssert } from '../support/pages/forms/CommonForm'
import { userPermissionsForm } from '../support/pages/forms/UserPermissionsForm'
import { homePageAssert } from '../support/pages/HomePage'
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

//New User Data
const newUserName = dataHelper.randName('test_n', 10, '_')
const fullName = dataHelper.randFulName()
const fullNameLang2 = fullName.toUpperCase()
const idNumber = (Date.now()).toString()
const gender = dataHelper.selectRandomOfArray(['F', 'M'])
const privilegeGrpLeader = ENV_CONFIG.PRIVILEGE_GRP_LEADER
const companyId = ENV_CONFIG.COMPANY_SHORT_NAME
const email = dataHelper.randEmail().toLowerCase()
const newUserPassword = faker.internet.password(6)
console.log(`Password: ${newUserPassword}`)
console.log(`Username: ${newUserName}`)

jest.retryTimes(0)
jest.setTimeout(300000)

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetBrowser()
})

describe.skip('Creation User', () => {

    test('Create New User', async () => {
        //Login
        await loginPage.login(URL, username, password)
        await homePageAssert.isSelectedCompany(companyName)
        //open Parameter Input for New User
        await page.setViewport({ width: 2014, height: 800 }) //set viewport larger, so System Management is visible
        await mainMenu.selectMainMenuTab('System Management')
        await mainMenu.selectTabMenu('System Maintenance')
        await mainMenu.selectTabMenu('Users')
        await mainMenu.selectTabParameterInput('Add New User')
        //Set values
        await commonParameterInputModal.clickClearValues()
        await commonParameterInputModal.setInputValue('User Name', newUserName)
        await commonParameterInputModal.setInputValue('Full Name', fullName)
        await commonParameterInputModal.setInputValue('Full Name - Lang 2', fullNameLang2)
        await commonParameterInputModal.setInputValue('ID Number', idNumber)
        await commonParameterInputModal.setInputValue('Gender', gender)
        await commonParameterInputModal.setInputValue('Privilege Grp Leader', privilegeGrpLeader)
        await commonParameterInputModal.setInputValue('Company', companyId)
        await commonParameterInputModal.setInputValue('Email', email)
        await commonParameterInputModal.clickButton('OK')
        //Verify modal message
        await commonModalAssert.isBodyText('The program was successfully completed.', 40000)
        await commonModal.clickOkBtn()
        //Open assign password Parameter Input
        await mainMenu.selectMainMenuTab('System Management')
        await mainMenu.selectTabMenu('System Maintenance')
        await mainMenu.selectTabMenu('Users')
        await mainMenu.selectTabParameterInput('Assign Password')
        //Set password
        await commonParameterInputModal.clickClearValues()
        await commonParameterInputModal.setInputValue('User', newUserName)
        await commonParameterInputModal.setInputValue('New Password', newUserPassword)
        await commonParameterInputModal.setInputValue('Verify Password', newUserPassword)
        // await jestPuppeteer.debug()
        await commonParameterInputModal.clickButton('OK')
        await basicHelper.waitForNetworkIdle(300)
        await commonModalAssert.isTitleText('Assign Password', 10000)
        await commonModalAssert.isBodyText(MODAL_MESSAGES.PASSWORD_ASSIGNED)
        await commonModal.clickOkBtn()
    })

    test('Assert New User Can Login', async () => {
        //Assert new user can login
        await page.waitFor(100000)
        await loginPage.login(URL, newUserName, newUserPassword)
        await homePageAssert.isSelectedCompany(companyName)
    })
})

afterAll(async () => {
    await basicHelper.clearTabs()
    await page.setViewport({ width: 2014, height: 800 })
    await loginPage.login(URL, username, password)
    await homePageAssert.isSelectedCompany(companyName)
    await mainMenu.selectMainMenuTab('System Management')
    await mainMenu.selectTabMenu('System Maintenance')
    await mainMenu.selectTabMenu('Users')
    await mainMenu.selectTabForm('User Permissions')
    await commonFormAssert.isBreadCrumbHasText('User Permissions')
    //Search user and deactivate
    await commonFormMenu.switchToTableRecordViewNoChangeIcon()
    await userPermissionsForm.searchUserName(newUserName)
    await userPermissionsForm.waitUntilUserNameNotInQueryMode()
    await userPermissionsForm.clickPermissionsTab()
    await userPermissionsForm.unCheckActiveUserCheckbox()
    await commonFormMenu.closeScreen()
    await commonModalAssert.isTitleText('Exit Form')
    await commonModal.clickOkBtn()
    await homePageAssert.isOpenedWindowsNumber('0')
})