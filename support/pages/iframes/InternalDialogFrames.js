const textEditorFrameSelector = 'iframe.HTMLFrameStyle'
const textFieldFrameSelector = 'iframe#_pritextarea'
const textInputFields = 'p[dir]'

export const internalDialogFrames = {

    async setIntoTextArea(text, i) {
        const textFieldFrameInEditMode = await this.switchContextToTextEdit()
        await expect(textFieldFrameInEditMode)
            .toClick(textInputFields + `:nth-child(${i})`, { timeout: 5000 })
        await expect(textFieldFrameInEditMode)
            .toFill(textInputFields + `:nth-child(${i})`, text)
    },

    async clickTextViewArea() {
        await page.waitForSelector(textEditorFrameSelector, { timeout: 5000 })
        const frameHandle = await page.$(textEditorFrameSelector)
        const frameBody = await frameHandle.contentFrame()
        await frameBody.waitForSelector(textInputFields)
        await frameBody.click('body')
    },

    async selectAllInTextArea() {
        const textFieldFrameInEditMode = await this.switchContextToTextEdit()
        await textFieldFrameInEditMode.evaluate(() => document.execCommand('selectall', false, null))
    },

    async switchContextToTextEdit() {
        await page.waitForSelector(textEditorFrameSelector, { timeout: 2000 })
        const frameHandle1 = await page.$(textEditorFrameSelector)//take control over iframe
        await (await frameHandle1.contentFrame()).waitForSelector(textFieldFrameSelector, { timeout: 2000 })
        const textEditorFrame = await frameHandle1.contentFrame()
        const frameHandle2 = await textEditorFrame.$(textFieldFrameSelector)//take control over child iframe
        await (await frameHandle2.contentFrame()).waitForSelector("p", { timeout: 2000 })
        return await frameHandle2.contentFrame()
    },

    async clickTextEditArea() {
        const frameBody = await this.switchContextToTextEdit()
        await frameBody.waitForSelector(textInputFields)
        await expect(frameBody).toClick(textInputFields)
    }
}

export const internalDialogFramesAssertion = {

    async isLineTextInViewMode(text, i) {
        await page.waitForSelector(textEditorFrameSelector, { timeout: 2000 })
        const frameHandle = await page.$(textEditorFrameSelector)
        const textEditorFrame = await frameHandle.contentFrame()
        const viewModeTextLines = await textEditorFrame.$$(textInputFields)
        const lineText = await (await viewModeTextLines[i].getProperty('textContent')).jsonValue()
        expect(lineText).toBe(text)
    },

    async isLineTextInEditmode(text, i) {
        const textFieldFrameInEditMode = await internalDialogFrames.switchContextToTextEdit()
        const editModeTextLines = await textFieldFrameInEditMode.$$(textInputFields)
        const lineText = await (await editModeTextLines[i].getProperty('textContent')).jsonValue()
        expect(lineText).toBe(text)
    },

    async isTextFieldCleared() {
        const textFieldFrameInEditMode = await internalDialogFrames.switchContextToTextEdit()
        const editModeTextLinesNumber = (await textFieldFrameInEditMode.$$("p")).length
        expect(editModeTextLinesNumber).toBeLessThanOrEqual(3)
    }
}