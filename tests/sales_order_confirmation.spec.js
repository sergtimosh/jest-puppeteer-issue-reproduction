import { ENV_CONFIG } from '../support/data/env_config'
import { basicHelper } from '../support/helpers/BasicHelper'
import { fileHelper } from '../support/helpers/FileHelper'
import { mailHelper } from '../support/helpers/MailHelper'
import { commonForm, commonFormAssert } from '../support/pages/forms/CommonForm'
import { composeMailForm, composeMailFormAssert } from '../support/pages/forms/ComposeMailForm'
import { orderItemsSubForm, salesOrdersForm } from '../support/pages/forms/SalesOrdersForm'
import { homePage, homePageAssert } from '../support/pages/HomePage'
import { loginPage } from '../support/pages/LoginPage'
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu'
import { mainMenu } from '../support/pages/menus/MainMenu'
import { commonModal, commonModalAssert } from '../support/pages/modals/CommonModal'
import { orderConfirmationPopup } from '../support/pages/modals/OrderConfirmationPopup'
import { commonParameterInputModal, commonParameterInputModalAssert } from '../support/pages/modals/ParameterInputModal'
import { reportModal, reportModalAssert } from '../support/pages/modals/ReportModal'

const username = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const custNumber = ENV_CONFIG.CUSTOMERS.CUSTOMER_1.NUMBER
const companyName = ENV_CONFIG.COMPANY_NAME
const URL = ENV_CONFIG.URL
const tempDownloads = 'temp_downloads/'

// jest.retryTimes(0)

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetBrowser()
    await loginPage.login(URL, username, password)
    await homePageAssert.isSelectedCompany(companyName)
})

describe('Order Confirmation', () => {

    test('Printout Order Confirmation', async () => {
        await basicHelper.waitForNetworkIdle(300)
        await homePage.clickTile('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders', 8000)
        await commonFormMenu.switchToTableRecordView()

        await salesOrdersForm.setCustomerNumber(custNumber)
        const orderNumber = await salesOrdersForm.getOrderNumber()
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickMenuButton('Order Confirmation')

        //select confirmation option an confirm
        await orderConfirmationPopup.selectDisplayTile()
        // await orderConfirmationPopup.switchToSystemDocument()
        await orderConfirmationPopup.clickDropdownIcon()
        await orderConfirmationPopup.selectDropdownValue('Standard Format')
        await orderConfirmationPopup.uncheckOption('PDF File')
        const pageTarget = page.target() //save target of original page to know that this was the opener
        await orderConfirmationPopup.confirm()

        //wait for new tab
        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget) //check that the first page opened this new page
        const page2 = await newTarget.page() //get the new page object

        //assert page
        await expect(page2)
            .toMatchElement('title', {
                text: 'Order Confirmation', timeout: 5000
            })
        await expect(page2)
            .toMatchElement('body', {
                text: ' Confirmation of Order ', timeout: 5000
            })

        const documentOrderNumber = await page2.$eval('a[title="Document Number"]', el => el.innerText)
        expect(documentOrderNumber).toBe(orderNumber)
    })

    test('Send Email Order Confirmation', async () => {
        const testId = new Date().getTime()
        const to = await mailHelper.createRandomEmail(testId)
        const from = ENV_CONFIG.USERS.USER_1.EMAIL2

        await basicHelper.waitForNetworkIdle(300)
        await homePageAssert.isSelectedCompany(companyName)
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders', 5000)
        await commonFormMenu.switchToTableRecordView()

        await salesOrdersForm.setCustomerNumber(custNumber)
        const orderNumber = await salesOrdersForm.getOrderNumber()
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickMenuButton('Order Confirmation')

        //select confirmation option an confirm
        await orderConfirmationPopup.selectEmailTile()
        await orderConfirmationPopup.clickDropdownIcon()
        await orderConfirmationPopup.selectDropdownValue('Standard Format')
        await orderConfirmationPopup.uncheckOption('PDF File')
        await orderConfirmationPopup.confirm()

        //assert Compose Mail subject and set email address
        const subject = `Order Confirmation - ${orderNumber}`
        await commonFormAssert.isBreadCrumbHasText('Compose Mail')
        const actualSubject = await composeMailForm.getSubject()
        expect(actualSubject).toBe(subject)
        await composeMailForm.setEmail(to)

        //Verify attachments
        await composeMailForm.clickAttachmentsTab()
        const attachmentsInputValue = await composeMailForm.getAttachmentsInputText()
        expect(attachmentsInputValue).toMatch(new RegExp(subject))
        await page.keyboard.press('Escape')

        //Send Mail
        await commonFormMenu.clickMenuButton('Send Mail & Delete')
        await commonModalAssert.isTitleText('Send Mail & Delete')
        await commonModal.clickOkBtn()
        await commonModalAssert.isTitleText('1 mail message(s) sent.', 10000)
        await commonModal.clickOkBtn()

        //verify compose mail form is cleared
        await composeMailFormAssert.isSubjectEmpty()
        await composeMailFormAssert.isEmailEmpty()

        //verify mailBox
        let emails = await mailHelper.messageChecker()
        let startTime = Date.now()
        while (emails.length === 0 && Date.now() - startTime < 20000) {
            console.log(`Polling mail from: ${from}...`)
            await page.waitFor(5000)
            emails = await mailHelper.messageChecker()
            console.log(emails)
        }
        expect(emails.length).toBeGreaterThanOrEqual(1)
        expect(emails[0].subject).toBe(subject)
    })

    test('Predefined Word Template Confirmation', async () => {
        const partNumber = ENV_CONFIG.PARTS.PART1.NUMBER
        const price = 100
        const quantity = 10
        const dueDate = new Date().toLocaleDateString('en-US', { year: "2-digit", month: "2-digit", day: "2-digit" })

        await page.setViewport({ width: 1800, height: 800 }) //set viewport larger, so Due Date is visible

        //open Sales Orders
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await commonFormMenu.switchToTableRecordView()
        //set Customer
        await salesOrdersForm.setCustomerNumber(custNumber)
        const orderNumber = await salesOrdersForm.getOrderNumber()
        //open Order Items sub-form and set data
        await orderItemsSubForm.clickTab()
        await commonFormAssert.isBreadCrumbHasText('Order Items')
        await commonFormMenu.switchToMultiRecordView()
        await orderItemsSubForm.setPartNumber(partNumber)
        await orderItemsSubForm.setQuantity(quantity)
        await orderItemsSubForm.setPrice(price)
        await orderItemsSubForm.setDueDate(dueDate)
        await page.keyboard.press('Escape')
        await commonForm.waitBreadCrumbHasNoText('Order Items')

        //select confirmation option an confirm
        await commonFormMenu.clickMenuButton('Order Confirmation')
        await orderConfirmationPopup.selectDisplayTile()
        await orderConfirmationPopup.clickDropdownIcon()
        await orderConfirmationPopup.selectDropdownValue('Predefined Template')
        await orderConfirmationPopup.checkOption('PDF File')
        await orderConfirmationPopup.confirm()
        //define test behavior depending on browser mode(there is a bug in chromium when opening pdf https://github.com/puppeteer/puppeteer/issues/610)
        let printoutURL
        console.log(process.env)
        if (process.env.DEBUG) {
            //headed case
            const pageTarget = page.target() //remember what page is an 'opener'
            //catch new tab
            const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget)
            page = await newTarget.page()
            printoutURL = page.url()
            console.log(printoutURL)
        } else {
            //headless case
            // catch response text
            const response = await page.waitForResponse(req => req.url().endsWith('/priwcf/service.svc'), { timeout: 10000 })
            console.log(`response body: ${await response.text()}`)
            const xmlResponse = await response.text()

            //parse xml from response text
            const json = basicHelper.parseStringSync(xmlResponse)

            //find print result string(encoded to Base64)
            const base64String = json["s:Envelope"]["s:Body"][0]
                .ProcAskPrintOKResponse[0]
                .ProcAskPrintOKResult
                .toString()

            //decode Base64 string and find url using regular expression
            const stringBuffer = new Buffer.from(base64String, 'base64')
            const string = stringBuffer.toString()
            const regex = new RegExp(/^(https:)\S*/gm)
            printoutURL = string.match(regex)[0]
            console.log(printoutURL)
        }
        const fileName = printoutURL.substring(printoutURL.lastIndexOf('/') + 1)
        const fileExtension = printoutURL.substring(printoutURL.lastIndexOf('.'))
        await fileHelper.createDirectory(tempDownloads)
        await fileHelper.downloadHttps(printoutURL, tempDownloads + fileName)
        const filesize = await fileHelper.getFilesizeInBytes(tempDownloads + fileName)
        const textFromPDF = await fileHelper.getPdfText(tempDownloads + fileName)
        expect(filesize).toBeGreaterThan(0)
        expect(fileExtension).toBe('.pdf')
        expect(textFromPDF).toContain(orderNumber)
    })

    test('Printout Sales Order Report for Two Orders', async () => {
        const partNumber = ENV_CONFIG.PARTS.PART1.NUMBER
        const price = 100
        const quantity = 10
        const dueDate = new Date().toLocaleDateString('en-US', { year: "2-digit", month: "2-digit", day: "2-digit" })

        await page.setViewport({ width: 1800, height: 800 }) //set viewport larger, so Due Date is visible

        //create order1
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await commonFormMenu.switchToTableRecordView()
        await salesOrdersForm.setCustomerNumber(custNumber)
        const orderNumber = await salesOrdersForm.getOrderNumber()
        await orderItemsSubForm.clickTab()
        await commonFormAssert.isBreadCrumbHasText('Order Items')
        await commonFormMenu.switchToMultiRecordView()
        await orderItemsSubForm.setPartNumber(partNumber)
        await orderItemsSubForm.setQuantity(quantity)
        await orderItemsSubForm.setPrice(price)
        await orderItemsSubForm.setDueDate(dueDate)
        await page.keyboard.press('Escape')
        await commonForm.waitBreadCrumbHasNoText('Order Items')

        //create order2
        await basicHelper.sendTwoKeysKombo('Control', 'Enter')
        await salesOrdersForm.waitUntilOrderNumberFieldEmpty()
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await salesOrdersForm.setCustomerNumber(custNumber)
        const orderNumber2 = await salesOrdersForm.getOrderNumber()
        await basicHelper.waitForNetworkIdle(1000)
        await orderItemsSubForm.clickTab()
        await commonFormAssert.isBreadCrumbHasText('Order Items')
        await commonFormMenu.switchToMultiRecordView()
        await basicHelper.waitForNetworkIdle(300)
        await orderItemsSubForm.setPartNumber(partNumber)
        await orderItemsSubForm.setQuantity(quantity)
        await orderItemsSubForm.setPrice(price)
        await orderItemsSubForm.setDueDate(dueDate)
        await page.keyboard.press('Escape')
        await commonForm.waitBreadCrumbHasNoText('Order Items')

        console.log(orderNumber, orderNumber2)

        //select Order Confirmation report 
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabMenu('Sales Order Reports')
        await mainMenu.selectTabMenu('Order Confirmations')
        await mainMenu.selectTabDocument('Order Confirmation')

        await reportModalAssert.isTitle('Order Confirmation')
        await reportModal.selectRadioButton('New')
        await reportModal.selectRadioButton('Standard')
        await reportModal.clickButton('OK')

        await basicHelper.waitForNetworkIdle(500)
        await commonParameterInputModalAssert.isModalTitle()
        await commonParameterInputModal.clearInputField('Order')
        await commonParameterInputModal.clickSearchIconForInput('Order')
        await commonFormAssert.isBreadCrumbHasText('Order Confirmation')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')

        //set both order numbers in search
        await salesOrdersForm.setOrderNumber(orderNumber)
        await page.keyboard.press('F11')
        await page.waitFor(1000)
        await salesOrdersForm.waitUntilOrderNumberFieldEmpty()
        await salesOrdersForm.setOrderNumber(orderNumber2)
        await page.keyboard.press('Enter')
        await salesOrdersForm.waitUntilCustomerNumberHasValue()
        await page.keyboard.press('Escape')
        await commonModal.clickOkBtn()

        //confirm selection
        await basicHelper.waitForNetworkIdle(800)
        await commonParameterInputModal.clickButton('OK')

        //select confirmation option an confirm
        await orderConfirmationPopup.selectDisplayTile()
        await orderConfirmationPopup.clickDropdownIcon()
        await orderConfirmationPopup.selectDropdownValue('Standard Format')
        await orderConfirmationPopup.uncheckOption('PDF File')
        const pageTarget = page.target() //save target of original page to know that this was the opener
        await orderConfirmationPopup.confirm()

        //wait for new tab
        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget) //check that the first page opened this new page
        const page2 = await newTarget.page() //get the new page object

        //assert page
        await expect(page2)
            .toMatchElement('title', {
                text: 'Order Confirmation', timeout: 5000
            })
        await expect(page2)
            .toMatchElement('body', {
                text: ' Confirmation of Order ', timeout: 5000
            })

        //assert orderNumbers
        const documentOrderNumbers = await page2.$$eval('a[title="Document Number"]', el => el.map(el => el.textContent))
        expect(documentOrderNumbers[0]).toBe(orderNumber)
        expect(documentOrderNumbers[1]).toBe(orderNumber2)
    })
})

afterAll(async () => {
    //clean up temp files and dir
    await fileHelper.deleteDirectory(tempDownloads)
})