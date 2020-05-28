import { ENV_CONFIG } from "../support/data/env_config"
import { MODAL_MESSAGES as MODAL_MESSAGES } from "../support/data/modalMessages"
import { basicHelper } from "../support/helpers/BasicHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { mailHelper } from "../support/helpers/MailHelper"
import { commonFormAssert } from "../support/pages/forms/CommonForm"
import { salesOrdersForm } from "../support/pages/forms/SalesOrdersForm"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { commonFormMenu } from "../support/pages/menus/CommonFormMenu"
import { mainMenu } from "../support/pages/menus/MainMenu"
import { businessRulesModal, businessRulesModalAssert } from "../support/pages/modals/BusinessRulesModal"
import { commonModal, commonModalAssert } from "../support/pages/modals/CommonModal"

// jest.retryTimes(0)

const faker = require('faker')
const URL = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME
const customerNumber = ENV_CONFIG.CUSTOMERS.CUSTOMER_1.NUMBER
const userEmail = ENV_CONFIG.USERS.USER_1.EMAIL2
let conditionValue
let ruleRecordsCount = 0

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetPage()
    await loginPage.login(URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 8)
    await homePageAssert.isSelectedCompany(compName)
})

describe.skip('Define Business Rules', () => {

    test('Create and Verify Business Rule to Display Warning', async () => {
        const ruleDescription = `Test Warning Rule Description ${Date.now()}`
        const message = `Test Warning Message: ${Date.now()} - ${faker.random.words(20)}`
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])
        //open sales order form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()
        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewBusinessRuleModal = await businessRulesModalAssert.isNewRuleModalOpened()
        if (!isNewBusinessRuleModal) {
            ruleRecordsCount = await businessRulesModal.countRecords()
            console.log('Deleteing existing rules...')
            await businessRulesModal.deleteAllRecords(ruleRecordsCount)
            await businessRulesModal.clickButton('New')
        }
        //set values
        await businessRulesModal.selectActionDropDownValue('Display warning')
        await businessRulesModal.setDescription(ruleDescription)
        await businessRulesModal.setMessage(message)
        await businessRulesModal.selectConditionDropDownValue('the value', 0)
        await businessRulesModal.selectConditionDropDownValue('% Overall Discount', 1)
        await businessRulesModal.selectConditionDropDownValue('is greater than or equals', 2)
        await businessRulesModal.setConditionInputValue(conditionValue, 0)
        await businessRulesModal.clickButton('OK')
        await businessRulesModal.waitForNewRuleModalClosed()
        //assert that rule is added to list
        await businessRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await businessRulesModalAssert.isRulePresentInList(message)
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()
        //set discount value > = conditionValue
        await salesOrdersForm.setCustomerNumber(customerNumber)
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue + 1)
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isBodyText(message)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()
        //set discount value inside the range of condition values
        await salesOrdersForm.setOveralDiscount(conditionValue - 1)
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText(MODAL_MESSAGES.EXIT_FORM)
        await commonModal.clickBtnByText('Cancel')
        //delete all existing rules
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        ruleRecordsCount = await businessRulesModal.countRecords()
        await businessRulesModal.deleteAllRecords(ruleRecordsCount)
        //assert business rule is deleted and not applied
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue + 1) //set discount value > = conditionValue
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText(MODAL_MESSAGES.EXIT_FORM)
    })

    test('Create and Verify Business Rule to Display Error', async () => {
        const ruleDescription = `Test Error Rule Description ${Date.now()}`
        const message = `Test Error Message: ${Date.now()} - ${faker.random.words(20)}`
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])
        //open sales order form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()
        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewBusinessRuleModal = await businessRulesModalAssert.isNewRuleModalOpened()
        if (!isNewBusinessRuleModal) {
            ruleRecordsCount = await businessRulesModal.countRecords()
            console.log('Deleting existing rules...')
            await businessRulesModal.deleteAllRecords(ruleRecordsCount)
            await businessRulesModal.clickButton('New')
        }
        //set values
        await businessRulesModal.selectActionDropDownValue('Display error msg')
        await businessRulesModal.setDescription(ruleDescription)
        await businessRulesModal.setMessage(message)
        await businessRulesModal.selectConditionDropDownValue('the value', 0)
        await businessRulesModal.selectConditionDropDownValue('% Overall Discount', 1)
        await businessRulesModal.selectConditionDropDownValue('is smaller than or equals', 2)
        await businessRulesModal.setConditionInputValue(conditionValue, 0)
        await businessRulesModal.clickButton('OK')
        await businessRulesModal.waitForNewRuleModalClosed()
        //assert that rule is added to list
        await businessRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await businessRulesModalAssert.isRulePresentInList(message)
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()
        //set discount value > = conditionValue
        await salesOrdersForm.setCustomerNumber(customerNumber)
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue - 1)
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isBodyText(message)
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await commonModal.clickBtnByText('OK')
        await commonModal.waitForModalNotVisible()
        //set discount value inside the range of condition values
        await salesOrdersForm.setOveralDiscount(conditionValue + 1)
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText(MODAL_MESSAGES.EXIT_FORM)
        await commonModal.clickBtnByText('Cancel')
        //delete all existing rules
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        ruleRecordsCount = await businessRulesModal.countRecords()
        await businessRulesModal.deleteAllRecords(ruleRecordsCount)
        //assert business rule is deleted and not applied
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue - 1) //set discount value > = conditionValue
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText(MODAL_MESSAGES.EXIT_FORM)
    })

    test('Create and Verify Business Rule to Send Email', async () => {
        const randNum = Date.now()
        const ruleDescription = `Test Email Rule Description ${randNum}`
        const message = `Test Email Message ${randNum}: ${faker.random.words(20)}`
        const subject = `Test Email Message Subject ${randNum}: ${faker.random.words(3)}`
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])
        //open sales order form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()

        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewBusinessRuleModal = await businessRulesModalAssert.isNewRuleModalOpened()
        if (!isNewBusinessRuleModal) {
            ruleRecordsCount = await businessRulesModal.countRecords()
            console.log('Deleting existing rules...')
            await businessRulesModal.deleteAllRecords(ruleRecordsCount)
            await businessRulesModal.clickButton('New')
        }
        //set values
        await businessRulesModal.selectActionDropDownValue('Send e-mail')
        await businessRulesModal.selectDropdownByOrder('e-mail address', 1)
        await businessRulesModal.setMailToInput(userEmail)
        await businessRulesModal.setDescription(ruleDescription)
        await businessRulesModal.setSubject(subject)
        await businessRulesModal.setMessage(message)
        await businessRulesModal.selectDropdownByOrder('Order Confirmation', 2)
        await businessRulesModal.selectDropdownByOrder('Assembly', 3)
        await businessRulesModal.selectConditionDropDownValue('the value', 0)
        await businessRulesModal.selectConditionDropDownValue('% Overall Discount', 1)
        await businessRulesModal.selectConditionDropDownValue('is greater than or equals', 2)
        await businessRulesModal.setConditionInputValue(conditionValue, 0)
        await businessRulesModal.clickButton('OK')
        await businessRulesModal.waitForNewRuleModalClosed()
        //assert that rule is added to list
        await businessRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await businessRulesModalAssert.isRulePresentInList(`to ${userEmail}: ${subject}`, 45)
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()
        //set discount value > = conditionValue
        await salesOrdersForm.setCustomerNumber(customerNumber)
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue + 1)
        //assert business rule message
        await commonFormMenu.closeScreen()

        //verify mailBox
        let emails = await mailHelper.messageChecker()
        let startTime = Date.now()
        while (emails.length === 0 && Date.now() - startTime < 20000) {
            console.log(`Polling mail from: ${userEmail}...`)
            await page.waitFor(5000)
            emails = await mailHelper.messageChecker()
            console.log(emails)
        }
        expect(emails.length).toBeGreaterThanOrEqual(1)
        expect(emails[0].subject).toContain(subject.substr(0, 50))
        const emailBodyHtml = emails[0].body.html
        const actualMessage = mailHelper.getBodyText(emailBodyHtml)
        expect(actualMessage.trim()).toBe(message)

        //clear rules
        await commonModal.clickBtnByText('Cancel')
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        ruleRecordsCount = await businessRulesModal.countRecords()
        await businessRulesModal.deleteAllRecords(ruleRecordsCount)
    })

    test('Create and Verify Business Rule to Display Warning with AND Logic', async () => {
        const ruleDescription = `Test Warning Rule Description ${Date.now()}`
        const message = `Test Warning Message: ${Date.now()} - ${faker.random.words(20)}`
        const defaultTitleMessage = MODAL_MESSAGES.EXIT_FORM
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])
        const conditionValue2 = 'EUR'
        //open sales order form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()
        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewBusinessRuleModal = await businessRulesModalAssert.isNewRuleModalOpened()
        if (!isNewBusinessRuleModal) {
            ruleRecordsCount = await businessRulesModal.countRecords()
            console.log('Deleteing existing rules...')
            await businessRulesModal.deleteAllRecords(ruleRecordsCount)
            await businessRulesModal.clickButton('New')
        }
        //set rule
        await businessRulesModal.selectActionDropDownValue('Display warning')
        await businessRulesModal.setDescription(ruleDescription)
        await businessRulesModal.setMessage(message)
        await businessRulesModal.selectConditionDropDownValue('the value', 0)
        await businessRulesModal.selectConditionDropDownValue('% Overall Discount', 1)
        await businessRulesModal.selectConditionDropDownValue('is greater than or equals', 2)
        await businessRulesModal.setConditionInputValue(conditionValue, 0)
        await businessRulesModal.clickButton('+')
        await businessRulesModal.selectConditionDropDownValue('Curr', 4)
        await businessRulesModal.selectConditionDropDownValue('is equal to', 5)
        await businessRulesModal.setConditionInputValue(conditionValue2, 1)
        await businessRulesModal.clickWhenRadioButton(0)
        await businessRulesModal.clickButton('OK')
        await businessRulesModal.waitForNewRuleModalClosed()
        //assert that rule is added to list
        await businessRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await businessRulesModalAssert.isRulePresentInList(message)
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()

        //(Assertion 1)set Discount value && Currency fulfilling the rule
        await salesOrdersForm.setCustomerNumber(customerNumber)
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue + 1)
        await salesOrdersForm.setCurrency(conditionValue2)
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText('Business Rule')
        await commonModalAssert.isBodyText(message)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()

        //(Assertion 2)set Discount value out of rule range && leave Currency in-rule
        await salesOrdersForm.setOveralDiscount(conditionValue - 1)
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText(defaultTitleMessage)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()

        //(Assertion 3)set Discount value in the rule range && change Currency out of the rule
        await salesOrdersForm.setOveralDiscount(conditionValue)
        await salesOrdersForm.setCurrency('$')
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText(defaultTitleMessage)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()

        //delete all existing rules
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        ruleRecordsCount = await businessRulesModal.countRecords()
        await businessRulesModal.deleteAllRecords(ruleRecordsCount)
    })

    test('Create and Verify Business Rule to Display Warning with OR Logic', async () => {
        const ruleDescription = `Test Warning Rule Description ${Date.now()}`
        const message = `Test Warning Message: ${Date.now()} - ${faker.random.words(20)}`
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])
        const conditionValue2 = 'EUR'
        console.log(`Condition value: ${conditionValue}`)
        //open sales order form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()
        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewBusinessRuleModal = await businessRulesModalAssert.isNewRuleModalOpened()
        if (!isNewBusinessRuleModal) {
            ruleRecordsCount = await businessRulesModal.countRecords()
            console.log('Deleteing existing rules...')
            await businessRulesModal.deleteAllRecords(ruleRecordsCount)
            await businessRulesModal.clickButton('New')
        }
        //set rule
        await businessRulesModal.selectActionDropDownValue('Display warning')
        await businessRulesModal.setDescription(ruleDescription)
        await businessRulesModal.setMessage(message)
        await businessRulesModal.selectConditionDropDownValue('the value', 0)
        await businessRulesModal.selectConditionDropDownValue('% Overall Discount', 1)
        await businessRulesModal.selectConditionDropDownValue('is greater than or equals', 2)
        await businessRulesModal.setConditionInputValue(conditionValue, 0)
        await businessRulesModal.clickButton('+')
        await businessRulesModal.selectConditionDropDownValue('Curr', 4)
        await businessRulesModal.selectConditionDropDownValue('is equal to', 5)
        await businessRulesModal.setConditionInputValue(conditionValue2, 1)
        await businessRulesModal.clickWhenRadioButton(1)
        await businessRulesModal.clickButton('OK')
        await businessRulesModal.waitForNewRuleModalClosed()
        //assert that rule is added to list
        await businessRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await businessRulesModalAssert.isRulePresentInList(message)
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()

        //(Assertion 1)set Discount value && Currency fulfilling the rule
        await salesOrdersForm.setCustomerNumber(customerNumber)
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue + 1)
        await salesOrdersForm.setCurrency(conditionValue2)
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText('Business Rule')
        await commonModalAssert.isBodyText(message)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()

        //(Assertion 2)set Discount value out of rule range && leave Currency in-rule
        await salesOrdersForm.setOveralDiscount(conditionValue - 1)
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText('Business Rule')
        await commonModalAssert.isBodyText(message)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()

        //(Assertion 3)set Discount value in the rule range && change Currency out of the rule
        await salesOrdersForm.setOveralDiscount(conditionValue)
        await salesOrdersForm.setCurrency('$')
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText('Business Rule')
        await commonModalAssert.isBodyText(message)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()

        //delete all existing rules
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        ruleRecordsCount = await businessRulesModal.countRecords()
        await businessRulesModal.deleteAllRecords(ruleRecordsCount)
    })

    test('Copy Businnes Rule', async () => {
        const ruleDescription = `Test Error Rule Description ${Date.now()}`
        const message = `Test Error Message: ${Date.now()} - ${faker.random.words(20)}`
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])
        const conditionObject = '% Overall Discount'
        const conditionState = 'is smaller than or equals'
        //open sales order form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()
        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewBusinessRuleModal = await businessRulesModalAssert.isNewRuleModalOpened()
        if (!isNewBusinessRuleModal) {
            ruleRecordsCount = await businessRulesModal.countRecords()
            console.log('Deleteing existing rules...')
            await businessRulesModal.deleteAllRecords(ruleRecordsCount)
            await businessRulesModal.clickButton('New')
        }
        //create business rule
        await businessRulesModal.selectActionDropDownValue('Display error msg')
        await businessRulesModal.setDescription(ruleDescription)
        await businessRulesModal.setMessage(message)
        await businessRulesModal.selectConditionDropDownValue('the value', 0)
        await businessRulesModal.selectConditionDropDownValue(conditionObject, 1)
        await businessRulesModal.selectConditionDropDownValue(conditionState, 2)
        await businessRulesModal.setConditionInputValue(conditionValue, 0)
        await businessRulesModal.clickButton('OK')
        await businessRulesModal.waitForNewRuleModalClosed()
        //assert that rule is added to list
        await businessRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await businessRulesModalAssert.isRulePresentInList(message)
        await businessRulesModalAssert.isRulesListActiveValue('✔')
        await businessRulesModalAssert.isRulesListActionValue('Display error msg')
        await businessRulesModalAssert.isRulesListDetailsValue(message)
        await businessRulesModalAssert.isRulesListConditionValue(`if '${conditionObject}' ${conditionState} ${conditionValue}`)
        const initialRuleNumber = await businessRulesModal.getRuleNumber(0)
        //Create Copy
        await businessRulesModal.clickButton('Copy')
        await businessRulesModal.waitForRecordsCountToBe(2)
        //Assert Copy values in the rules list
        await businessRulesModalAssert.isRulesListActiveValue('✔', 1)
        await businessRulesModalAssert.isRulesListRuleNumberValue(parseInt(initialRuleNumber) + 1, 1)
        await businessRulesModalAssert.isRulesListActionValue('Display error msg', 1)
        await businessRulesModalAssert.isRulesListDetailsValue(message, 1)
        await businessRulesModalAssert.isRulesListConditionValue(`if '${conditionObject}' ${conditionState} ${conditionValue}`, 1)
        await businessRulesModal.selectRuleByOrder(1)
        await businessRulesModal.clickButton('Edit')
        //Assert Copy in the Edit Popup
        await businessRulesModalAssert.isConditionInputValue(conditionValue)
        await businessRulesModal.clickButton('Cancel')
        await businessRulesModal.waitForRuleModalClosed()
        // //delete all existing rules
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        ruleRecordsCount = await businessRulesModal.countRecords()
        await businessRulesModal.deleteAllRecords(ruleRecordsCount)
    })

    test('Make Rule Inactive', async () => {
        const ruleDescription = `Test Error Rule Description ${Date.now()}`
        const message = `Test Error Message: ${Date.now()} - ${faker.random.words(20)}`
        conditionValue = dataHelper.selectRandomOfArray([15, 20, 35, 51])
        //open sales order form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()
        //set business rule
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        //conditional: select steps depending on presence of rules
        const isNewBusinessRuleModal = await businessRulesModalAssert.isNewRuleModalOpened()
        if (!isNewBusinessRuleModal) {
            ruleRecordsCount = await businessRulesModal.countRecords()
            console.log('Deleting existing rules...')
            await businessRulesModal.deleteAllRecords(ruleRecordsCount)
            await businessRulesModal.clickButton('New')
        }
        //set values
        await businessRulesModal.selectActionDropDownValue('Display error msg')
        await businessRulesModal.setDescription(ruleDescription)
        await businessRulesModal.setMessage(message)
        await businessRulesModal.selectConditionDropDownValue('the value', 0)
        await businessRulesModal.selectConditionDropDownValue('% Overall Discount', 1)
        await businessRulesModal.selectConditionDropDownValue('is smaller than or equals', 2)
        await businessRulesModal.setConditionInputValue(conditionValue, 0)
        await businessRulesModal.clickButton('OK')
        await businessRulesModal.waitForNewRuleModalClosed()
        //assert that rule is added to list
        await businessRulesModal.waitForRecordsCountToBe(ruleRecordsCount + 1)
        await businessRulesModalAssert.isRulePresentInList(message)
        //uncheck rule and close modal
        await businessRulesModal.uncheckActiveCheckboxByIndex(0)
        await businessRulesModalAssert.isRulesListActiveValue('')
        await businessRulesModal.clickButton('Back to List')
        await businessRulesModal.waitForRuleModalClosed()
        //Assert that rule doesn't trigger if set inactive
        await salesOrdersForm.setCustomerNumber(customerNumber)
        await salesOrdersForm.clickPriceTab()
        await salesOrdersForm.setOveralDiscount(conditionValue - 1)
        //assert business rule message
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText(MODAL_MESSAGES.EXIT_FORM)
        await commonModal.clickBtnByText('Cancel')
        await commonModal.waitForModalNotVisible()
        //delete all existing rules
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Define Business Rules')
        await businessRulesModalAssert.isTitle('Define Business Rules - Sales Orders')
        ruleRecordsCount = await businessRulesModal.countRecords()
        await businessRulesModal.deleteAllRecords(ruleRecordsCount)
    })
})