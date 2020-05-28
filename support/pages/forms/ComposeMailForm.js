const subjectInputs = '.inlineManual_MAILBOXSEND_SUBJECT'
import { basicHelper } from '../../helpers/BasicHelper';
const emailInputs = '.inlineManual_MAILBOXSEND_EMAIL'

export const composeMailForm = {

    async setSubject(value, i = 0) {
        await basicHelper.isElementVisibleByWidth(subjectInputs, 3000)
        await basicHelper.setFormInputValue(subjectInputs, value, i)
        const actualValue = await basicHelper.getInputValue(subjectInputs, i)
        expect(actualValue).toBe(value)
    },

    async getSubject() {
        await page.click(subjectInputs)
        await page.waitForFunction(subjectInputs =>
            document.querySelector(subjectInputs)
                .value
                .length > 0, {}, subjectInputs)
        return await page.$eval(subjectInputs, el => el.value)
    },

    async getEmail() {
        await page.click(subjectInputs)
        await page.waitForFunction(subjectInputs =>
            document.querySelector(subjectInputs)
                .value
                .length > 0, {}, subjectInputs)
        return await page.$eval(subjectInputs, el => el.value)
    },

    async setEmail(value, i = 0) {
        await page.waitForSelector(emailInputs, { timeout: 5000 })
        const elements = await page.$$(emailInputs)
        await elements[i].click()
        await elements[i].type(value)
    },

    async clickAttachmentsTab() {
        await page.waitForSelector(attachmentsTab)
        await page.click(attachmentsTab)
    },

    async getAttachmentsInputText(i = 0) {
        await page.waitFor(2000)
        return await (await page.$$eval(attachmentInputs, inputs => {
            return inputs.map(input => input.value)
        }))[i]
    }
}

export const composeMailFormAssert = {

    async isSubjectEmpty() {
        const subject = await page.$eval(subjectInputs, el => el.value)
        expect(subject.length).toBe(0)
    },

    async isEmailEmpty() {
        const email = await page.$eval(emailInputs, el => el.value)
        expect(email.length).toBe(0)
    }
}

const attachmentInputs = '.inlineManual_ATTACHMENTS_ATTACHMENT'
const attachmentsTab = '.inlineManual_sb_ATTACHMENTS'
const attachFileButton = '.innerZoomButton'
const attachFileHiddenInput = 'input[type="file"]'

export const attachmentsForm = {

    async clickIntoInputField(i = 0) {
        await basicHelper.isElementVisibleByWidth(attachmentInputs)
        await basicHelper.clickUntilInputNotReadOnly(attachmentInputs, i)
    },

    async clickAttachFileIcon() {
        await page.waitForSelector(attachFileButton, { timeout: 5000 })
        await page.click(attachFileButton)
    },

    async getAttachmentsInputValue(i = 0) {
        await basicHelper.isElementVisibleByWidth(attachmentInputs)
        await basicHelper.waitForInputNotEmpty(attachmentInputs, i)
        return await (await page.$$eval(attachmentInputs, inputs => {
            return inputs.map(input => input.value)
        }))[i]
    },

    async waitAttachmentsInputEmpty(i = 0) {
        await basicHelper.isElementVisibleByWidth(attachmentInputs)
        await basicHelper.waitForInputEmpty(attachmentInputs, i)
    },

    async triggerUpload(i = 0) {
        const uploadHandle = (await page.$$(attachFileHiddenInput))[i]
        await uploadHandle.evaluate(upload => upload.dispatchEvent(new Event('change', { bubbles: true }))) //manually trigger event
    }
}