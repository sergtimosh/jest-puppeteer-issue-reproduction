import { ENV_CONFIG } from '../support/data/env_config';
import { MODAL_MESSAGES } from '../support/data/modalMessages';
import { basicHelper } from '../support/helpers/BasicHelper';
import { fileHelper } from '../support/helpers/FileHelper';
import { commonForm, commonFormAssert } from '../support/pages/forms/CommonForm';
import { attachmentsForm, composeMailForm } from '../support/pages/forms/ComposeMailForm';
import { homePageAssert } from "../support/pages/HomePage";
import { loginPage } from '../support/pages/LoginPage';
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu';
import { mainMenu } from '../support/pages/menus/MainMenu';
import { commonModal, commonModalAssert } from '../support/pages/modals/CommonModal';

const URL = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME
const mailSubject = 'Subject' + (Math.random() * 1000).toFixed(3)
const dataFile = 'support/data/files/text.txt'
const tempDownloads = require("path").join(process.cwd(), 'temp_downloads/')
const dir = 'support/data/files/temp/'
const testFileName = fileHelper.randFilename('document', 'xls')
const testLongFilename = fileHelper.randFilename('more_than_26_characters_string', 'csv')
const testExeFileName = fileHelper.randFilename('document', 'exe')

// jest.retryTimes(0)

beforeEach(async () => {
    await fileHelper.deleteDirectory(tempDownloads)
    await fileHelper.deleteDirectory(dir)
    await jestPuppeteer.resetBrowser()
    await loginPage.login(URL + '&_nativeupload=1', userName, password)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Mail Attachments', () => {

    test('Upload and Download mail attachments', async () => {
        //open Send Mail form
        await basicHelper.waitForNetworkIdle(500)
        await mainMenu.clickHamburgerMenu()
        await basicHelper.waitForNetworkIdle(500)
        await mainMenu.clickHamburgerMail()
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickHamburgerSendMail()
        await commonFormAssert.isBreadCrumbHasText('Compose Mail')
        await composeMailForm.setSubject(mailSubject)
        await composeMailForm.clickAttachmentsTab()
        await commonFormAssert.isBreadCrumbHasText('Attachments')
        //prepare valid test file
        await fileHelper.createDirectory(dir)
        await fileHelper.createDirectory(tempDownloads)
        let dataFileBuffer = await fileHelper.readFile(dataFile)
        const initialFilePath = await fileHelper.createFile(dataFileBuffer, testFileName, dir)
        //click upload button and set file
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(), //wait for browser native upload
            attachmentsForm.clickAttachFileIcon(), //click button that triggers file selection
        ])
        await fileChooser.accept([initialFilePath])
        await attachmentsForm.triggerUpload()
        //verify filename in the input
        let attachmentsValue = await attachmentsForm.getAttachmentsInputValue()
        expect(attachmentsValue
            .substring(attachmentsValue.lastIndexOf('/') + 1))
            .toBe(testFileName)
        //verify attachment is saved
        await page.keyboard.press('Escape')
        await commonForm.waitBreadCrumbHasNoText('Attachments')
        await commonFormAssert.isBreadCrumbHasText('Compose Mail')
        const request = (await Promise.all([
            composeMailForm.clickAttachmentsTab(),
            page.waitForRequest(req => req.url().endsWith(testFileName))
        ]))[1]
        await fileHelper.downloadHttps(request.url(), tempDownloads + testFileName)
        const initialFileHash = await fileHelper.getFileHash(initialFilePath)
        const downloadedFileHash = await fileHelper.getFileHash(tempDownloads + testFileName)
        expect(downloadedFileHash).toBe(initialFileHash)
        await commonFormMenu.clickDeleteIcon()
        await commonModal.clickBtnByText('Yes, delete it')
        await attachmentsForm.waitAttachmentsInputEmpty()
        await page.keyboard.press('Escape')
        await commonForm.waitBreadCrumbHasNoText('Attachments')
        await composeMailForm.clickAttachmentsTab()
        await commonFormAssert.isBreadCrumbHasText('Attachments')
        attachmentsValue = await attachmentsForm.getAttachmentsInputValue()
        expect(attachmentsValue).toBe('')

        //prepare file with name length > 26 characters
        const initialLongFilePath = await fileHelper.createFile(dataFileBuffer, testLongFilename, dir)
        //upload file
        const [fileChooser2] = await Promise.all([
            page.waitForFileChooser(), //wait for browser native upload
            attachmentsForm.clickAttachFileIcon(), //click button that triggers file selection
        ])
        await fileChooser2.accept([initialLongFilePath])
        await attachmentsForm.triggerUpload()
        //verify filename in the input is trimmed to 25 characters
        attachmentsValue = await attachmentsForm.getAttachmentsInputValue()
        const trimmedFilename = fileHelper.trimFilename(testLongFilename, 26)
        expect(attachmentsValue
            .substring(attachmentsValue.lastIndexOf('/') + 1))
            .toBe(trimmedFilename)

        //prepare non-valid test file()
        const initialExeFilePath = await fileHelper.createFile(dataFileBuffer, testExeFileName, dir)
        //try to upload file
        await attachmentsForm.clickIntoInputField(1)
        const [fileChooser3] = await Promise.all([
            page.waitForFileChooser(), //wait for browser native upload
            attachmentsForm.clickAttachFileIcon(), //click button that triggers file selection
        ])
        await fileChooser3.accept([initialExeFilePath])
        await attachmentsForm.triggerUpload()
        //verify modal message
        const errMessage = MODAL_MESSAGES.FILE_TYPE_ERROR
        await commonModal.waitForAttentionModal()
        await commonModalAssert.isTitleText(errMessage)
        await commonModal.clickOkBtn()
        //verify files aren't uploaded(not visible in input)
        await commonModal.waitForModalNotVisible()
        await basicHelper.waitForNetworkIdle(200)
        attachmentsValue = await attachmentsForm.getAttachmentsInputValue(1)
        expect(attachmentsValue).toBe('')
        //verify first input still contains attachments
        attachmentsValue = await attachmentsForm.getAttachmentsInputValue()
        expect(attachmentsValue
            .substring(attachmentsValue.lastIndexOf('/') + 1))
            .toBe(trimmedFilename)
    })
})