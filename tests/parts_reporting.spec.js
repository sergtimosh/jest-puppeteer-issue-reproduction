import { ENV_CONFIG } from '../support/data/env_config';
import { basicHelper } from '../support/helpers/BasicHelper';
import { fileHelper, fileHelperAssert } from '../support/helpers/FileHelper';
import { homePageAssert } from '../support/pages/HomePage';
import { loginPage } from '../support/pages/LoginPage';
import { mainMenu } from '../support/pages/menus/MainMenu';
import { commonParameterInputModal, commonParameterInputModalAssert, partsReportParameterInputModal } from '../support/pages/modals/ParameterInputModal';
import { reportModal, reportModalAssert } from '../support/pages/modals/ReportModal';

// jest.retryTimes(0)

const URL = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME
const partNumber = ENV_CONFIG.PARTS.PART1.NUMBER
const tempDownloads = 'temp_downloads/'

beforeEach(async () => {
    await fileHelper.deleteDirectory(tempDownloads)
    await jestPuppeteer.resetBrowser()
    await loginPage.login(URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 10)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Parts Report', () => {

    test('Send Part Report to Excell', async () => {
        await fileHelper.createDirectory(tempDownloads)
        await fileHelper.setDownloadBehavior(tempDownloads)
       
        //select parts reporting modal
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabMenu('Part Reports')
        await mainMenu.selectTabReport('Parts')

        //set values in Parts reporting modal
        await reportModalAssert.isTitle('Parts')
        await reportModal.selectRadioButton('New')
        await reportModal.selectRadioButton('Send to Spreadsheet')
        await reportModal.selectDropdownValue('Basic')
        await reportModal.clickButton('OK')

        //set values in Parameter Input modal
        await commonParameterInputModalAssert.isModalTitle()
        await partsReportParameterInputModal.clickSelectPartIcon()
        await partsReportParameterInputModal.selectFilterByText('By Number')
        await partsReportParameterInputModal.setValueIntoSearchField(partNumber)
        await partsReportParameterInputModal.selectFilteredResult(partNumber)
        await basicHelper.waitForNetworkIdle(500)

        //click OK and wait for specific(by header value) request to server
        await Promise.all([
            commonParameterInputModal.clickButton('OK'),
            page.waitForRequest(req => req.url().endsWith('.svc') && req.headers().soapaction === 'http://tempuri.org/IWCFService/ProcCreateSpreadsheet')
        ])

        // verify downloaded file name, extension, content
        const fileName = await fileHelper.waitForFileToDownload(tempDownloads)
        expect(fileName).toContain('Parts')
        await fileHelperAssert.isFileExtension(fileName, '.xlsx')
        const actualPartNumber = await fileHelper.getCellValue(tempDownloads + fileName, 'A2')
        expect(actualPartNumber).toBe(partNumber)
    })

    afterAll(async () => {
        await fileHelper.deleteDirectory(tempDownloads)
    })
})