import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { fileHelper, fileHelperAssert } from "../support/helpers/FileHelper"
import { commonFormAssert } from "../support/pages/forms/CommonForm"
import { customersForm } from "../support/pages/forms/CustomersForm"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { commonFormMenu } from "../support/pages/menus/CommonFormMenu"
import { mainMenu } from "../support/pages/menus/MainMenu"
import { popupMenu } from "../support/pages/menus/PopupMenu"
import { commonModal } from "../support/pages/modals/CommonModal"
import { commonParameterInputModal } from "../support/pages/modals/ParameterInputModal"
import { reportModal, reportModalAssert, templateSelectorModal, templateSelectorModalAssert } from "../support/pages/modals/ReportModal"
import { templatesModal, templatesModalAssert } from "../support/pages/modals/TemplatesModal"

// jest.retryTimes(0)

const URL = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME
const tempDownloads = 'temp_downloads/'
let templatesCount = 0

beforeEach(async () => {
    await fileHelper.deleteDirectory(tempDownloads)
    await basicHelper.clearTabs()
    await jestPuppeteer.resetPage()
    await loginPage.login(URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 8)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Report Template', () => {

    test('Create Report Template', async () => {
        const templateName = `template ${Date.now()}`
        const customerNumber = '*'
        const excelTemplate = 'support/data/files/ListOfCustomersReportTemplate.xlsx'
        const sheetName = 'test sheet'

        //create download folder
        await fileHelper.createDirectory(tempDownloads)

        //open customers report dialog
        await mainMenu.selectMainMenuTab('CRM')
        await mainMenu.selectTabMenu('Customers')
        await mainMenu.selectTabMenu('Customer Reports')
        await mainMenu.selectTabReport('List of Customers')

        //open Design Template dialog
        await reportModalAssert.isTitle('List of Customers')
        await reportModal.selectRadioButton('Send to Spreadsheet')
        await reportModal.clickButton('Design')
        await popupMenu.clickMenuItem('Design Excel Template')

        //create new template
        await templatesModalAssert.isTitleText('List of Customers')
        await templatesModal.setName(templateName)
        await templatesModal.clickNew()
        await commonParameterInputModal.clickClearValues()
        await commonParameterInputModal.setInputValue('Customer Number', customerNumber)
        await commonParameterInputModal.clickButton('OK')

        //upload modified template
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(), //wait for browser native upload
            templatesModal.clickImportByTemplateName(templateName), //click button that triggers file selection
        ])
        await fileChooser.accept([excelTemplate])
        await templatesModal.triggerUpload()
        await basicHelper.waitForNetworkIdle(2000)

        //create report
        await mainMenu.selectMainMenuTab('CRM')
        await mainMenu.selectTabReport('List of Customers')
        await reportModalAssert.isTitle('List of Customers')
        await reportModal.selectRadioButton('Send to Spreadsheet')
        await reportModal.clickButton('OK')
        await templateSelectorModal.selectTemplate(templateName)
        await reportModal.clickButton('OK')
        await commonParameterInputModal.clickClearValues()
        await commonParameterInputModal.setInputValue('Customer Number', customerNumber)

        //set download behavior
        await fileHelper.setDownloadBehavior(tempDownloads)

        //click OK and wait for specific(by header value) request to server
        await Promise.all([
            commonParameterInputModal.clickButton('OK'),
            page.waitForRequest(req => req.url().endsWith('.svc') && req.headers().soapaction === 'http://tempuri.org/IWCFService/ProcCreateSpreadsheet')
        ])

        // verify downloaded file name, extension, content
        const fileName = await fileHelper.waitForFileToDownload(tempDownloads)
        expect(fileName).toContain('Customers')
        await fileHelperAssert.isFileExtension(fileName, '.xlsx')
        const actualSheetName = await fileHelper.getExcellSheetName(tempDownloads + fileName, 1)
        expect(actualSheetName).toBe(sheetName)

        //delete template(s)
        await mainMenu.selectMainMenuTab('CRM')
        await mainMenu.selectTabReport('List of Customers')
        await reportModalAssert.isTitle('List of Customers')
        await reportModal.clickButton('Design')
        await popupMenu.clickMenuItem('Design Excel Template')
        templatesCount = await templatesModal.countTemplates()
        await templatesModal.deleteNRecords(templatesCount - 1, 1)
    })

    test('Create Report Template Within the Form', async () => {
        const templateName = `template ${Date.now()}`
        const customerNumber = ENV_CONFIG.CUSTOMERS.CUSTOMER_1.NUMBER
        const excelTemplate = 'support/data/files/ListOfCustomersReportTemplate.xlsx'
        const sheetName = 'test sheet'

        //create download folder
        await fileHelper.createDirectory(tempDownloads)

        //open Customers form
        await mainMenu.selectMainMenuTab('CRM')
        await mainMenu.selectTabMenu('Customers')
        await mainMenu.selectTabForm('Customers')
        await commonFormAssert.isBreadCrumbHasText('Customers')

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        //query all customers
        await commonFormMenu.switchToTableRecordView()
        // await customersForm.searchCustomersNumber(customerNumber)
        await customersForm.setCustomerNumber(customerNumber)
        await basicHelper.waitForNetworkIdle(1000)

        //open spreadsheet template generator
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Spreadsheet Template Generator')
        await templateSelectorModalAssert.isTitle('Design Templates')

        //create new template
        await templatesModal.setName(templateName)
        await templatesModal.clickNew()

        //import modified xlsx
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(), //wait for browser native upload
            templatesModal.clickImportByTemplateName(templateName), //click button that triggers file selection
        ])
        await fileChooser.accept([excelTemplate])
        await templatesModal.triggerUpload()
        await basicHelper.waitForNetworkIdle(2000)

        //set download behavior
        await fileHelper.setDownloadBehavior(tempDownloads)

        //export customer using new template
        await commonFormMenu.clickExportIcon()
        await templateSelectorModal.selectTemplate(templateName)
        await reportModal.clickButton('OK')

        // verify downloaded file name, extension, content
        const fileName = await fileHelper.waitForFileToDownload(tempDownloads)
        expect(fileName).toContain('Customers')
        await fileHelperAssert.isFileExtension(fileName, '.xlsx')
        const actualSecondSheetName = await fileHelper.getExcellSheetName(tempDownloads + fileName, 1)
        const actualCustomersNumber = await fileHelper.getCellValue(tempDownloads + fileName, 'A2')
        expect(actualSecondSheetName).toBe(sheetName)
        expect(actualCustomersNumber).toBe(customerNumber)

        //delete created template
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Spreadsheet Template Generator')
        await templateSelectorModalAssert.isTitle('Design Templates')
        templatesCount = await templatesModal.countTemplates()
        await templatesModal.deleteNRecords(templatesCount - 1, 1)
    })

    afterAll(async () => {
        await fileHelper.deleteDirectory(tempDownloads)
    })
})