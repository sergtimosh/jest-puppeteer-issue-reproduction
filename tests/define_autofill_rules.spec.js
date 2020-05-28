import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { commonFormAssert } from "../support/pages/forms/CommonForm"
import { salesOrdersForm, salesOrdersFormAssert } from "../support/pages/forms/SalesOrdersForm"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { commonFormMenu } from "../support/pages/menus/CommonFormMenu"
import { mainMenu } from "../support/pages/menus/MainMenu"
import { autofillRulesModal, autofillRulesModalAssert } from "../support/pages/modals/AutofillRulesModal"
import { commonModal } from "../support/pages/modals/CommonModal"

jest.retryTimes(0)

const URL = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME
let conditionValue
let ruleRecordsCount = 0

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetPage()
    await loginPage.login(URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 8)
    await homePageAssert.isSelectedCompany(compName)
    //open sales order form
    await mainMenu.selectMainMenuTab('Sales')
    await mainMenu.selectTabMenu('Orders')
    await mainMenu.selectTabForm('Sales Orders')
    await commonFormAssert.isBreadCrumbHasText('Sales Orders')
    await commonFormMenu.switchToTableRecordView()
})

describe.skip('Define Autofill Rules', () => {

    test('Create and verify Autofill Rule', async () => {
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Autofill Rules')
        await autofillRulesModalAssert.isTitle('Define Autofill Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewAutofillRule = await autofillRulesModalAssert.isNewRuleModalOpened()
        if (!isNewAutofillRule) {
            ruleRecordsCount = await autofillRulesModal.countRecords()
            console.log('Deleteing existing rules...')
            await autofillRulesModal.deleteAllRecords(ruleRecordsCount)
            await autofillRulesModal.clickButton('New')
        }
        //set values
        await autofillRulesModal.selectActionDropDownValue('% Overall Discount', 0)
        await autofillRulesModal.selectActionDropDownValue('Date', 1)
        await autofillRulesModal.setActionInputValue('today')
        await autofillRulesModal.selectConditionDropDownValue('the value', 0)
        await autofillRulesModal.selectConditionDropDownValue('% Overall Discount', 1)
        await autofillRulesModal.selectConditionDropDownValue('is equal to', 2)
        await autofillRulesModal.setConditionInputValue(conditionValue, 0)
        await autofillRulesModal.clickButton('OK')
        const actualDate = new Date().toLocaleDateString('en-US', { year: "2-digit", month: "2-digit", day: "2-digit" })
        //Assert record is present in the list
        await autofillRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await autofillRulesModalAssert.isRulePresentInList(`if '% Overall Discount' is equal to ${conditionValue}`)
        await autofillRulesModal.clickButton('Back to List')
        await autofillRulesModal.waitForRulesModalClosed()
        //asert rule isn't triggered
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue + 1)
        await basicHelper.waitForNetworkIdle(1000)
        await salesOrdersFormAssert.isDate('')
        await salesOrdersForm.setOveralDiscount(conditionValue - 1)
        await basicHelper.waitForNetworkIdle(1000)
        await salesOrdersFormAssert.isDate('')
        //assert rule is triggered
        await salesOrdersForm.setOveralDiscount(conditionValue)
        await salesOrdersForm.waitUntilDateHasValue()
        await salesOrdersFormAssert.isDate(actualDate)
        //cleanup rules
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Autofill Rules')
        ruleRecordsCount = await autofillRulesModal.countRecords()
        await autofillRulesModal.deleteAllRecords(ruleRecordsCount)
    })
})