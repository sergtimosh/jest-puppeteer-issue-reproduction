import { basicHelper } from "../helpers/BasicHelper";

const loginPanel = '.loginlabel_panelStyle';
const usernameInput = '.loginlabel_textboxstyle[type = "text"]';
const passwordInput = '.loginlabel_textboxstyle[type = "password"]'
const okBtn = '.loginlabel_buttonStyle1'
const errorElement = '.loginlabel_errorText'

export const loginPage = {

    async navigate(url) {
        await Promise.all([
            page.goto(url, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
    },

    async reload() {
        await Promise.all([
            page.reload({ waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
    },

    async login(url, username, password) {
        const context = browser.defaultBrowserContext()
        await context.overridePermissions(url, ['geolocation'])
        await Promise.all([
            page.goto(url, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
        await page.waitForSelector(loginPanel)
        await basicHelper.clear(usernameInput)
        await basicHelper.clear(passwordInput)
        await page.type(usernameInput, username)
        await page.type(passwordInput, password)
        await page.click(okBtn)
    },

    async fillLoginForm(username, password) {
        await page.waitForSelector(loginPanel)
        await basicHelper.clear(usernameInput)
        await page.type(usernameInput, username)
        await basicHelper.clear(passwordInput)
        await page.type(passwordInput, password)
    }
}

export const loginPageAssert = {

    async isLoginPanelPresent() {
        await page.waitForSelector(loginPanel, { visible: true })
        const content = await page.$eval(loginPanel, el => el.textContent)
        expect(content).toMatch('Username')
        expect(content).toMatch('Password')
        expect(content).toMatch('OK')
        expect(content).toMatch('Forgot password?')
    },
    
    async isLoginErrorMessage(text) {
        await page.waitForSelector(errorElement, { visible: true })
        const content = await page.$eval(errorElement, el => el.textContent)
        expect(content).toBe(text)

    }
}