import expect from 'expect-puppeteer';
import { basicHelper } from './support/helpers/BasicHelper';
const path = require('path');

const loginPanel = '.loginlabel_panelStyle'
const usernameInput = '.loginlabel_textboxstyle[type = "text"]';
const passwordInput = '.loginlabel_textboxstyle[type = "password"]'
const okBtn = '.loginlabel_buttonStyle1'
const popupDropdown = '.priModalDialog .choosecompanydlg_textBoxStyle'
const popupBtns = 'div[role="button"]'
const companiesList = '.inlineManual_chooseItem'
const dialogTitle = '#PriModalDialog .DialogCaption'
const companySelector = '#PriModalDialog .choosecompanydlg_textBoxStyle'
const companiesPanel = '.inlineManual_choosePanel'
const companyButton = '#companyName'

export const utils = {
    async firstLogin(page, url, username, password) {
        await Promise.all([
            page.goto(url, { waitUntil: 'domcontentloaded' }),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
        await page.waitForSelector(loginPanel)
        await page.type(usernameInput, username)
        await page.type(passwordInput, password)
        await page.click(okBtn)
    },

    async selectCompany(page, name) {
        await page.waitForSelector(dialogTitle, { visible: true, timeout: 35000 })
        await expect(page).toMatchElement(dialogTitle, { text: 'Select Company', timeout: 10000 })
        await basicHelper.waitForNetworkIdle(500, { optPage: page })
        await page.click(companySelector)
        await page.waitForSelector(companiesPanel)
        await expect(page).toClick(companiesList, { text: name })
    },

    async isSelectedCompanyInPopup(page, name) {
        const dropDownHandler = await page.$(popupDropdown)
        await expect(dropDownHandler).toMatch(name)
    },

    async isSelectedCompany(page, name) {
        await page.waitForSelector(`${companyButton}:not(:empty)`, { timeout: 10000 })
        const companyButtonHandler = await page.$(companyButton)
        await expect(companyButtonHandler).toMatch(name)
    },

    async submitCompanyPopup(page) {
        await page.waitForSelector(popupBtns)
        await expect(page).toClick(popupBtns, { text: 'OK' })
    },
}