import { ENV_CONFIG } from '../support/data/env_config';
import { basicHelper } from '../support/helpers/BasicHelper';
import { commonForm, commonFormAssert } from '../support/pages/forms/CommonForm';
import { customerShipmentsForm } from '../support/pages/forms/CustomerShipmentsForm';
import { entryJournalForm } from '../support/pages/forms/EntryJournalForm';
import { multiShipmentInvoicesForm } from '../support/pages/forms/MultiShipmentInvoicesForm';
import { invoiceItemsSubForm, salesInvoicesForm } from '../support/pages/forms/SalesInvoicesForm';
import { orderItemsSubForm, salesOrdersForm } from '../support/pages/forms/SalesOrdersForm';
import { homePage, homePageAssert } from '../support/pages/HomePage';
import { loginPage } from '../support/pages/LoginPage';
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu';
import { mainMenu } from '../support/pages/menus/MainMenu';
import { commonModal, commonModalAssert } from '../support/pages/modals/CommonModal';
import { orderConfirmationPopup } from '../support/pages/modals/OrderConfirmationPopup';

const url = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const companyName = ENV_CONFIG.COMPANY_NAME
const customerNumber = ENV_CONFIG.CUSTOMERS.CUSTOMER_1.NUMBER
const partNumber = ENV_CONFIG.PARTS.PART1.NUMBER
const price = 100
const quantity = 10
const dueDate = new Date().toLocaleDateString('en-US', { year: "2-digit", month: "2-digit", day: "2-digit" })

// jest.retryTimes(0)

describe('Create Order', () => {

    beforeEach(async () => {
        await basicHelper.clearTabs()
        await jestPuppeteer.resetBrowser()
        await page.setViewport({ width: 1800, height: 1280 })
        await loginPage.login(url, userName, password)
        await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 10)
        await homePageAssert.isSelectedCompany(companyName)
    })

    test('Create new Order', async () => {

        //open Sales Orders
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await commonFormMenu.switchToTableRecordView()
        //select Customer
        await salesOrdersForm.setCustomerNumber(customerNumber)
        const orderNumber = await salesOrdersForm.getOrderNumber()
        //open Order Items sub-form and set data
        await orderItemsSubForm.clickTab()
        await commonFormAssert.isBreadCrumbHasText('Order Items')
        await commonFormMenu.switchToMultiRecordView()
        await orderItemsSubForm.setPartNumber(partNumber)
        await orderItemsSubForm.setQuantity(quantity)
        await orderItemsSubForm.setPrice(price)
        await orderItemsSubForm.setDueDate(dueDate)
        await commonFormMenu.closeScreen()
        await commonModal.clickOkBtn()
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        //open order again
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await salesOrdersForm.searchOrderNumber(orderNumber)
        await salesOrdersForm.setStatus('Confirmed')

        await commonFormMenu.clickMenuButton('Prepare Shipping Document')
        await commonModal.clickOkBtn()
        await commonForm.waitBreadCrumbHasNoText('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Customer Shipments', 8000)
        await customerShipmentsForm.setStatus('Final')

        await commonFormMenu.clickActions()
        await commonFormMenu.clickActionsDropdownMenuItem('Prepare Invoice/Credit Memo')
        await commonModal.clickOkBtn()
        await commonForm.waitBreadCrumbHasNoText('Customer Shipments')
        await commonFormAssert.isBreadCrumbHasText('Multi-Shipment Invoices', 8000)
        await commonFormMenu.clickActions()
        await commonFormMenu.clickActionsDropdownMenuItem('Finalize Invoice/Memo')
        await commonModal.clickOkBtn()
        await commonModal.clickOkBtn()

        await multiShipmentInvoicesForm.clickPriceTab()
        const amountOwing = await multiShipmentInvoicesForm.getAmountOwing()
        await basicHelper.waitForNetworkIdle(500)
        await multiShipmentInvoicesForm.clickReferenceTab()
        await multiShipmentInvoicesForm.selectEntryNumberInput()
        await commonForm.clickInputSearch()

        await commonFormAssert.isBreadCrumbHasText('Entry Journal')
        const sum = await entryJournalForm.getSum()

        // assert sums are equal
        expect(sum).toBe(amountOwing)
    })

    test('Print Invoice to PDF', async () => {

        //open Sales Invoices Form and set customers number
        await homePage.clickTile('Sales Invoices')
        await commonFormAssert.isBreadCrumbHasText('Sales Invoices')
        await commonFormMenu.switchToTableRecordView()
        await salesInvoicesForm.setCustomerNumber(customerNumber)

        //set part number, quantity and price in Invoice Items tab
        await invoiceItemsSubForm.clickTab()
        await commonFormAssert.isBreadCrumbHasText('Invoice Items')
        await commonFormMenu.switchToMultiRecordView()
        await invoiceItemsSubForm.setPartNumber(partNumber)
        await invoiceItemsSubForm.setQuantity(quantity)
        await invoiceItemsSubForm.setPrice(price)

        //finalize Invoice and verify status
        await commonForm.clickBreadCrumbByText('Sales Invoices')
        await commonForm.waitBreadCrumbHasNoText('Invoice Items')
        await commonFormMenu.clickActions()
        await commonFormMenu.clickActionsDropdownMenuItem('Finalize Invoice/Memo')
        await commonModal.clickOkBtn()
        await commonModal.clickOkBtn()
        const status = await salesInvoicesForm.getStatus()
        expect(status).toBe('Final')

        await basicHelper.waitForNetworkIdle(500)

        //get Invoice number
        const invoiceNumber = await salesInvoicesForm.getInvoiceNumber()

        //print Invoice
        await commonFormMenu.clickActions()
        await commonFormMenu.clickActionsDropdownMenuItem('Print Sales Invoice')

        //select print option
        await orderConfirmationPopup.selectPrintTile()
        await orderConfirmationPopup.clickDropdownIcon()
        await orderConfirmationPopup.selectDropdownValue('Standard Format')
        // await orderConfirmationPopup.expandAdditionalOptions()
        // await orderConfirmationPopup.checkPDFoption()
        await orderConfirmationPopup.confirm()

        // catch response text
        const response = await page.waitForResponse(req => req.url().endsWith('/priwcf/service.svc'), { timeout: 5000 })
        console.log('response body: ' + await response.text())
        const xmlResponse = await response.text()

        //parse xml from response text
        const json = basicHelper.parseStringSync(xmlResponse)

        //find print result string(encoded to Base64)
        const base64String = json["s:Envelope"]["s:Body"][0]
            .ProcAskPrintOKResponse[0]
            .ProcAskPrintOKResult
            .toString()

        //decode Base64 string and find url with regular expression
        const stringBuffer = new Buffer.from(base64String, 'base64')
        const string = stringBuffer.toString()
        const regex = new RegExp(/^(https:)\S*/gm)
        const printoutURL = string.match(regex)[0]
        console.log(printoutURL)

        //close leave site dialog
        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
        })

        //open retrived url
        await jestPuppeteer.resetBrowser()
        await Promise.all([
            page.goto(printoutURL, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])

        await basicHelper.waitForElementHasTextContent('u', invoiceNumber)
        // await page.waitForSelector('u a[title="Document Number"]', { visible: true })
        // const actuaInvoiceNumber = await basicHelper.getElementText('u a[title="Document Number"]')
        // expect(actuaInvoiceNumber).toBe(invoiceNumber)
    })

    test('Verify Order is Present After Scroll in Single Record View', async () => {
        await page.setViewport({ width: 1280, height: 720 })
        //open Sales Orders
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await commonFormMenu.switchToTableRecordView()
        //select Customer
        await salesOrdersForm.setCustomerNumber(customerNumber)
        const orderNumber = await salesOrdersForm.getOrderNumber()
        //scroll down to activate next record
        await page.keyboard.press('PageDown')
        await salesOrdersForm.waitUntilOrderNumberFieldEmpty()
        //return to first record
        await page.keyboard.press('PageUp')
        await salesOrdersForm.waitUntilOrderNumber()
        const actualOrderNumber = await salesOrdersForm.getOrderNumber()
        expect(actualOrderNumber).toBe(orderNumber)
        //check 'Latest Updates' to contain order number in the list
        await homePage.clickFooterMenuTab('Latest Updates')
        await homePageAssert.isUpdatesListContainsText(orderNumber)
    })

    test('Verify Message when Order Created To Special Customer', async () =>{
        const customerNumber3 = ENV_CONFIG.CUSTOMERS.CUSTOMER_3.NUMBER
        //open Sales Orders
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm('Sales Orders')
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await commonFormMenu.switchToTableRecordView()
        //select Customer
        await salesOrdersForm.setCustomerNumberNoEnter(customerNumber3)
        await page.keyboard.press('Enter')
        await commonModalAssert.isTitleText('Testing 123!')
        await commonModal.clickOkBtn()
        await commonFormAssert.isBreadCrumbHasText('Sales Orders')
        await commonFormMenu.closeScreen()
        await commonModalAssert.isTitleText('Exit Form')
        await commonModal.clickOkBtn()
        await homePageAssert.isOpenedWindowsNumber('0')
    })
})