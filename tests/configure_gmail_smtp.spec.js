import { ENV_CONFIG } from '../support/data/env_config';
import { basicHelper } from '../support/helpers/BasicHelper';
import { mailHelper } from '../support/helpers/MailHelper';
import { commonFormAssert } from '../support/pages/forms/CommonForm';
import { composeMailForm, composeMailFormAssert } from '../support/pages/forms/ComposeMailForm';
import { salesOrdersForm } from '../support/pages/forms/SalesOrdersForm';
import { homePageAssert } from '../support/pages/HomePage';
import { loginPage } from '../support/pages/LoginPage';
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu';
import { mainMenu } from '../support/pages/menus/MainMenu';
import { commonModal, commonModalAssert } from '../support/pages/modals/CommonModal';
import { orderConfirmationPopup } from '../support/pages/modals/OrderConfirmationPopup';
import { commonParameterInputModal, commonParameterInputModalAssert, mailParameterInputModal } from '../support/pages/modals/ParameterInputModal';

const username = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const companyName = ENV_CONFIG.COMPANY_NAME
const googleEmail = ENV_CONFIG.USERS.USER_1.EMAIL2
const googlePassword = ENV_CONFIG.USERS.USER_1.MAIL2_PASSWORD

// jest.retryTimes(0)

describe('Configure GMAIL', () => {

    beforeEach(async () => {
        await basicHelper.clearTabs()
        await jestPuppeteer.resetBrowser()
        await loginPage.login(ENV_CONFIG.URL, username, password)
        await homePageAssert.isSelectedCompany(companyName)
    })

    test('Configure Other Mail', async () => {

        const testId = new Date().getTime()
        const username = ENV_CONFIG.USERS.USER_1.NAME
        const from = ENV_CONFIG.USERS.USER_1.EMAIL2
        const custNumber = ENV_CONFIG.CUSTOMERS.CUSTOMER_1.NUMBER
        const mailUsername = ENV_CONFIG.USERS.USER_1.EMAIL
        const mailPassword = ENV_CONFIG.USERS.USER_1.MAIL_PASSWORD
        const mailServer = ENV_CONFIG.USERS.USER_1.MAIL_SERVER2
        const subject = 'Priority External Mail Test'
        const to = await mailHelper.createRandomEmail(testId)

        //open gmail options from hamburger menu
        await basicHelper.waitForNetworkIdle(400)
        await mainMenu.clickHamburgerMenu()
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickHamburgerMail()
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickHamburgerMailOptions()
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickHamburgerOtherServers()

        //setup Parameters in Parameter Input modal
        await commonParameterInputModalAssert.isModalTitle()
        await commonParameterInputModal.clickClearValues()
        await commonParameterInputModal.setInputValue('Mail Server', mailServer)
        await commonParameterInputModal.setInputValue('User Name', mailUsername)
        await commonParameterInputModal.clearInputField('Password')
        await commonParameterInputModal.setInputValue('Password', mailPassword)
        await commonParameterInputModal.clearInputField('E-mail Address')
        await commonParameterInputModal.setInputValue('E-mail Address', to)
        await commonParameterInputModal.checkOption('Send Test Message?')
        await commonParameterInputModal.clickButton('OK')
        await commonModalAssert.isTitleText('Mail Options for Other Servers', 10000)
        await commonModalAssert.isBodyText('Test message was sent successfully.', 10000)
        await commonModal.clickOkBtn()

        //check test in the test-mailbox via google api
        let emails = await mailHelper.messageChecker()
        let startTime = Date.now()
        while (emails.length === 0 && Date.now() - startTime < 20000) {
            console.log(`Polling mail from: ${mailUsername}...`)
            await page.waitFor(5000)
            emails = await mailHelper.messageChecker()
            console.log(emails)
        }
        console.log(emails)
        expect(emails.length).toBeGreaterThanOrEqual(1)
        expect(emails[0].from).toBe(`${username} <${mailUsername}>`)
        expect(emails[0].receiver).toBe(to)
        expect(emails[0].subject).toBe(subject)


        //create order and verify email
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
        // await orderConfirmationPopup.switchToSystemDocument() //removed from dialog in v.20
        await orderConfirmationPopup.clickDropdownIcon()
        await orderConfirmationPopup.selectDropdownValue('Standard Format')
        // await orderConfirmationPopup.expandAdditionalOptions()
        await orderConfirmationPopup.uncheckOption('PDF File')
        await orderConfirmationPopup.confirm()

        //assert Compose Mail subject and set email address
        const subjectOrderConfirmation = `Order Confirmation - ${orderNumber}`
        await commonFormAssert.isBreadCrumbHasText('Compose Mail')
        const actualSubject = await composeMailForm.getSubject()
        expect(actualSubject).toBe(subjectOrderConfirmation)
        await composeMailForm.setEmail(from)

        //Verify attachments
        await composeMailForm.clickAttachmentsTab()
        const attachmentsInputValue = await composeMailForm.getAttachmentsInputText()
        expect(attachmentsInputValue).toMatch(new RegExp(subjectOrderConfirmation))
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

        //check mailbox via google api
        // emails = await mailHelper.messageChecker()
        // startTime = Date.now()
        // while (emails.length === 0 && Date.now() - startTime < 20000) {
        //     console.log(`Polling mail from: ${mailUsername}...`)
        //     await page.waitFor(5000)
        //     emails = await mailHelper.messageChecker()
        //     console.log(emails)
        // }
        // console.log(emails)
        // expect(emails.length).toBeGreaterThanOrEqual(1)
        // expect(emails[0].from).toBe(`${username} <${mailUsername}>`)
        // expect(emails[0].receiver).toBe(to)
        // expect(emails[0].subject).toBe(subjectOrderConfirmation)

        // const orderEmail = await mailHelper.inboxChecker(mailUsername, subjectOrderConfirmation)
        // expect(orderEmail.from).toBe(username + ' ' + '<' + mailUsername + '>')
        // expect(orderEmail.subject).toBe(subjectOrderConfirmation)

        // await jestPuppeteer.debug()
    })

    let OS = process.platform
    if (OS !== 'win32') {

        test('Configure GMAIL smtp in Priority', async () => {

            //open gmail options from hamburger menu
            await basicHelper.waitForNetworkIdle(400)
            await mainMenu.clickHamburgerMenu()
            await basicHelper.waitForNetworkIdle(300)
            await mainMenu.clickHamburgerMail()
            await basicHelper.waitForNetworkIdle(300)
            await mainMenu.clickHamburgerMailOptions()
            await basicHelper.waitForNetworkIdle(300)
            await mainMenu.clickHamburgerGmail()
            await mainMenu.clickHamburgerMailSettings()

            //catch new tab
            const pageTarget = page.target()
            const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget)
            page = await newTarget.page()
            await page.waitForSelector('head > meta[name="google-site-verification"]')

            //authentificate on google
            const selector = await basicHelper.raceSelectors(['input#Email', `[id="account-${googleEmail}"]`])
            console.log(selector)
            if (selector === 'input#Email') {
                await page.waitForSelector('input#Email', { visible: true, timeout: 5000 })
                await page.type('input#Email', googleEmail)
                await page.waitFor(500)
                const buttonNext = await page.waitForSelector('#next:not([disabled])', { visible: true, timeout: 5000 })
                await Promise.all([
                    buttonNext.click(),
                    page.waitForNavigation({ waitUntil: 'networkidle0' }),
                ])
                await page.waitForSelector('input[type="password"]', { visible: true, timeout: 5000 })
                await page.type('input[type="password"]', googlePassword)
                const signInButton = await page.waitForSelector('input[type="submit"]:not([disabled])', { visible: true, timeout: 5000 })
                await Promise.all([
                    await signInButton.click(),
                    page.waitForNavigation({ waitUntil: 'networkidle0' }),
                ])
            } else {
                await page.click(`[id="account-${googleEmail}"]`)
            }

            const submit = await page
                .waitForSelector('#submit_approve_access:not([disabled])', {
                    visible: true,
                    timeout: 5000
                })
            await submit.click()

            //get google access code
            await page.waitForSelector('textarea[readonly]', { visible: true, timeout: 5000 })
            const codeElement = await page.$('textarea[readonly]')
            const googleCode = await page.evaluate(el => el.textContent, codeElement)

            //close google page and switch to priority
            await page.close()
            page = (await browser.pages())[1]
            await page.bringToFront()

            //set Google Access Code and verify success message
            await commonParameterInputModal.clickClearValues()
            await basicHelper.waitForNetworkIdle(300)
            await mailParameterInputModal.setGoogleAccessCode(googleCode)
            await commonParameterInputModal.clickButton('OK')
            await commonModalAssert.isTitleText('Mail Options for Gmail', 10000)
            await commonModalAssert.isBodyText('SMTP server connection was successful.', 10000)
        })
    }

})