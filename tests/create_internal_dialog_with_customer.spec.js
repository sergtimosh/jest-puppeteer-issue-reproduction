import { ENV_CONFIG } from '../support/data/env_config'
import { MODAL_MESSAGES } from '../support/data/modalMessages'
import { basicHelper } from '../support/helpers/BasicHelper'
import { commonForm, commonFormAssert } from '../support/pages/forms/CommonForm'
import { salesOrdersForm } from '../support/pages/forms/SalesOrdersForm'
import { homePageAssert } from '../support/pages/HomePage'
import { internalDialogFrames, internalDialogFramesAssertion } from '../support/pages/iframes/InternalDialogFrames'
import { loginPage } from '../support/pages/LoginPage'
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu'
import { mainMenu } from '../support/pages/menus/MainMenu'
import { commonModal, commonModalAssert } from '../support/pages/modals/CommonModal'
import { subLevelSelectorModal } from '../support/pages/modals/SubLevelSelectorModal'

const custNumber = 'CTD_CUST_001'
const companyName = ENV_CONFIG.COMPANY_NAME
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const userName2 = ENV_CONFIG.USERS.USER_2.NAME
const password2 = ENV_CONFIG.USERS.USER_2.PASSWORD

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetBrowser()
    await loginPage.login(ENV_CONFIG.URL, userName, password)
    await homePageAssert.isSelectedCompany(companyName)
    await mainMenu.selectMainMenuTab('Sales')
    await mainMenu.selectTabMenu('Orders')
    await mainMenu.selectTabForm('Sales Orders')
    await commonFormAssert.isBreadCrumbHasText('Sales Orders', 5000)

    //temporary solution to close error popup
    try {
        const isPopupPresent = await page.evaluate(() => {
            return document.querySelector('.rc-dialog-title label').textContent.includes('is already connected to the system')
        })
        if (isPopupPresent) {
            await page.click('#reactModalBtns button')
            await page.waitFor(2000)
        }
    } catch (e) {
        console.log('no error dialog')
    }

    await commonFormMenu.switchToTableRecordView()
    await salesOrdersForm.setCustomerNumber(custNumber)

})

describe('Internal Dialog', () => {
    
    test('Create Internal Dialog', async () => {
        await page.keyboard.press('F5')
        await subLevelSelectorModal.selectSubLevelMenu('Internal Dialogue')
        await subLevelSelectorModal.confirm()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(800)

        await basicHelper.sendTwoKeysKombo('Control', 'KeyK')
        await basicHelper.waitForNetworkIdle(600)
        await internalDialogFrames.setIntoTextArea('Test\nTest\n', 2)
        await page.keyboard.press('Escape')
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(600)

        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 2)

        await internalDialogFrames.clickTextViewArea()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)

        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 2)
    })

    test('Delete Internal Dialog', async () => {
        await page.keyboard.press('F5')
        await subLevelSelectorModal.selectSubLevelMenu('Internal Dialogue')
        await subLevelSelectorModal.confirm()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(800)

        await basicHelper.sendTwoKeysKombo('Control', 'KeyK')
        await basicHelper.waitForNetworkIdle(300)

        await internalDialogFrames.setIntoTextArea('Test\nTest\n', 2) //Set comments
        await page.keyboard.press('Escape')
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)

        await internalDialogFrames.clickTextViewArea()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await internalDialogFrames.selectAllInTextArea()
        await page.keyboard.press('Delete')
        await internalDialogFramesAssertion.isTextFieldCleared()
        await page.keyboard.press('Escape')
        await commonModal.clickNoBtn() //Keep comments
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFrames.clickTextViewArea()
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 1) //Verify, comments remain
        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 2)

        await internalDialogFrames.selectAllInTextArea()
        await page.keyboard.press('Delete')
        await internalDialogFramesAssertion.isTextFieldCleared()
        await page.keyboard.press('Escape')
        await commonModal.clickYesBtn() //Dismiss comments
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)
        await salesOrdersForm.clickInternalDialogTab()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isTextFieldCleared() //Verify comments are dismissed
    })

    test('Concurrent Edit with One User', async () => {
        const orderNumber = await salesOrdersForm.getOrderNumber()
        await salesOrdersForm.waitUntilStatus('Draft')
        await page.keyboard.press('F5')
        await subLevelSelectorModal.selectSubLevelMenu('Internal Dialogue')
        await subLevelSelectorModal.confirm()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(800)

        await basicHelper.sendTwoKeysKombo('Control', 'KeyK')
        await basicHelper.waitForNetworkIdle(300)
        await internalDialogFrames.setIntoTextArea('Test\nTest\n', 2) //Set comments
        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 2)

        await salesOrdersForm.clickOrderNumber()
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(300)
        await internalDialogFrames.clickTextViewArea()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)

        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders', 5000)
        await commonFormMenu.switchToTableRecordView()
        await basicHelper.waitForNetworkIdle(500)
        await salesOrdersForm.clickOrderNumber()
        await page.keyboard.press('F11')
        await salesOrdersForm.setOrderNumber(orderNumber)
        await page.keyboard.press('Enter')
        await salesOrdersForm.waitUntilOrderNumber()
        await salesOrdersForm.waitUntilOrderNumberNotInQueryMode()
        await salesOrdersForm.waitUntilCustomerNumberHasValue()
        await basicHelper.waitForNetworkIdle(500)

        await page.keyboard.press('F5')
        await subLevelSelectorModal.selectSubLevelMenu('Internal Dialogue')
        await subLevelSelectorModal.confirm()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)

        //verify text is in view mode
        await commonModalAssert.isTitleText(MODAL_MESSAGES.CONCURRENT_EDIT_BY_SELF)
        await commonModal.clickBtnByText('Read-only')
        await internalDialogFrames.clickTextViewArea()
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 2)
        await salesOrdersForm.clickInternalDialogTab()
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 2)

        await salesOrdersForm.clickIntoCustomersNumberField()
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(300)
        await page.keyboard.press('F5')
        await subLevelSelectorModal.selectSubLevelMenu('Internal Dialogue')
        await subLevelSelectorModal.confirm()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')

        //verify text is in edit mode
        await commonModalAssert.isTitleText(MODAL_MESSAGES.CONCURRENT_EDIT_BY_SELF)
        await commonModal.clickBtnByText('Edit')
        await basicHelper.waitForNetworkIdle(1000)
        await basicHelper.sendTwoKeysKombo('Control', 'KeyK')
        await basicHelper.waitForNetworkIdle(600)
        await internalDialogFrames.setIntoTextArea('Test2\nTest2\n', 2)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 1)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 2)
        await salesOrdersForm.clickOrderNumber()
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(300)
        await internalDialogFrames.clickTextViewArea()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 1)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 2)
    })

    test('Concurrent Edit with Two Users', async () => {
        const orderNumber = await salesOrdersForm.getOrderNumber()
        await basicHelper.waitForNetworkIdle(500)
        await page.keyboard.press('F5')
        await subLevelSelectorModal.selectSubLevelMenu('Internal Dialogue')
        await subLevelSelectorModal.confirm()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(800)

        await basicHelper.sendTwoKeysKombo('Control', 'KeyK')
        await basicHelper.waitForNetworkIdle(300)
        await internalDialogFrames.setIntoTextArea('Test\nTest\n', 2) //Set comments
        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test', 2)

        await salesOrdersForm.clickIntoCustomersNumberField() //save changes
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(300)
        await salesOrdersForm.clickInternalDialogTab()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue') //open form in edit mode again

        page = await browser.newPage()
        await loginPage.login(ENV_CONFIG.URL, userName2, password2)
        await homePageAssert.isSelectedCompany(companyName)
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders', 5000)

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        await commonFormMenu.switchToTableRecordView()
        await basicHelper.waitForNetworkIdle(500)
        await salesOrdersForm.clickOrderNumber()
        await page.keyboard.press('F11')
        await salesOrdersForm.setOrderNumber(orderNumber)
        await page.keyboard.press('Enter')
        await salesOrdersForm.waitUntilOrderNumber()
        await salesOrdersForm.waitUntilOrderNumberNotInQueryMode()
        await salesOrdersForm.waitUntilCustomerNumberHasValue()
        await basicHelper.waitForNetworkIdle(500)
        await page.keyboard.press('F5')
        await subLevelSelectorModal.selectSubLevelMenu('Internal Dialogue')
        await subLevelSelectorModal.confirm()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await commonModalAssert.isTitleText(MODAL_MESSAGES.CONCURRENT_EDIT_BY_USER_1)
        await commonModal.clickOkBtn()
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(300)

        //verify text is in view mode
        await internalDialogFrames.clickTextViewArea()
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 2)
        await salesOrdersForm.clickInternalDialogTab()
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 1)
        await internalDialogFramesAssertion.isLineTextInViewMode('Test', 2)

        //switch to first tab
        page = (await browser.pages())[1]
        await page.bringToFront()

        //leave edit mode for user1
        await salesOrdersForm.clickIntoCustomersNumberField()
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(300)

        //switch to second tab
        page = (await browser.pages())[2]
        await page.bringToFront()
        await salesOrdersForm.clickOrderNumber()
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await salesOrdersForm.clickInternalDialogTab()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(800)
        await basicHelper.sendTwoKeysKombo('Control', 'KeyK')
        await basicHelper.waitForNetworkIdle(300)
        await internalDialogFrames.setIntoTextArea('Test2\nTest2\n', 2)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 1)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 2)
        await salesOrdersForm.clickOrderNumber()
        await commonForm.waitBreadCrumbHasNoText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(300)
        await internalDialogFrames.clickTextViewArea()
        await commonFormAssert.isBreadCrumbHasText('Internal Dialogue')
        await basicHelper.waitForNetworkIdle(500)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 1)
        await internalDialogFramesAssertion.isLineTextInEditmode('Test2', 2)
        const page2 = (await browser.pages())[1]
        await page2.close()
    })
})