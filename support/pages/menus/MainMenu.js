import { basicHelper } from "../../helpers/BasicHelper"

const mainMenuTabs = '.bottomHeader li.menue_li .merk_menu'
const tabMenus = '.menue_li .merk_menu_item_M'
const tabMenuContextIcon = '.merk_menuoptions'
const tabMenuContextDialogItems = '.subMenuBarStyle button'
const tabForms = '.menue_li .merk_menu_item_F'
const tabReport = '.menue_li .merk_menu_item_R'
const tabDocument = '.menue_li .merk_menu_item_D'
const tabParameterInput = '.menue_li .merk_menu_item_P'
const hamburgerMenu = '#hamburgerMenu'
const hamburgerMenuItems = '.toolBar dropDown'
const hamburgerRun = '#toolbar_menue_item_100'
const hamburgerMail = '#toolbar_menue_item_19'
const hamburgerMailOptions = '#toolbar_menue_item_60000'
const hamburgerGmail = '#toolbar_menue_item_1230'
const hamburgerOtherServers = '#toolbar_menue_item_1235'
const hamburgerMailSettings = '#toolbar_menue_item_1231'
const hamburgerRefresh = '#toolbar_menue_item_59'
const hamburgerSendMail = '#toolbar_menue_item_91'
const lastMenuOptions = '.lastMenu li a'

export const mainMenu = {

    //getters
    async getLastMenuList() {
        return await page.evaluate(lastMenuOptions => {
            return [...document.querySelectorAll(lastMenuOptions)]
                .map(el => el.firstChild.textContent)
        }, lastMenuOptions)
    },

    async selectMainMenuTab(text) {
        let startTime = Date.now()
        do {
            await basicHelper.clickElementSkipChildrenText(mainMenuTabs, text)
        } while (!(await basicHelper.isElementVisible(mainMenuTabs + '+ul.dropMenu'))
            || await basicHelper.isElementVisible(mainMenuTabs + '+ul.dropMenu.displayNone')
            && Date.now() - startTime < 5000)
    },

    async selectTabMenu(text) {
        let startTime = Date.now()
        do {
            await basicHelper.clickElementSkipChildrenText(tabMenus, text)
        } while (
            !(await basicHelper.isElementVisible(tabMenus + '+ul.dropMenu'))
            || await basicHelper.isElementVisible(mainMenuTabs + '+ul.dropMenu.displayNone')
            && Date.now() - startTime < 5000)
        await basicHelper.waitForNetworkIdle(500)
    },

    async selectTabForm(text) {
        let startTime = Date.now()
        do {
            await basicHelper.clickElementSkipChildrenText(tabForms, text)
        } while (
            !(await basicHelper.isResponse('service.svc', 2000))
            && Date.now() - startTime < 8000)
    },

    async selectTabReport(text) {
        let startTime = Date.now()
        do {
            await basicHelper.clickElementSkipChildrenText(tabReport, text)
        } while (
            !(await basicHelper.isResponse('service.svc', 2000))
            && Date.now() - startTime < 8000)
    },

    async selectTabDocument(text) {
        let startTime = Date.now()
        do {
            await basicHelper.clickElementSkipChildrenText(tabDocument, text)
        } while (
            !(await basicHelper.isResponse('service.svc', 2000))
            && Date.now() - startTime < 8000)
    },

    async selectTabParameterInput(text) {
        let startTime = Date.now()
        do {
            await basicHelper.clickElementSkipChildrenText(tabParameterInput, text)
        } while (
            !(await basicHelper.isResponse('service.svc', 2000))
            && Date.now() - startTime < 8000)
    },

    async clickHamburgerMenu() {
        await page.waitForSelector(hamburgerMenu, {
            timeout: 5000,
            visible: true
        })
        let startTime = Date.now()
        do {
            await page.click(hamburgerMenu)
        } while (!(basicHelper.isElementVisible(hamburgerMenuItems, 200))
            && Date.now() - startTime < 8000)
    },

    async clickHamburgerRun() {
        await page.waitForSelector(hamburgerRun, {
            timeout: 5000,
            visible: true
        })
        let startTime = Date.now()
        do {
            await page.click(hamburgerRun)
        } while (!(basicHelper.isElementVisible(hamburgerRun + '+ul'))
            && Date.now() - startTime < 8000)
    },

    async clickHamburgerRefresh() {
        await page.waitForSelector(hamburgerRefresh, {
            timeout: 5000,
            visible: true
        })
        await page.click(hamburgerRefresh)
    },

    async clickHamburgerMail() {
        await page.waitForSelector(hamburgerMail, {
            timeout: 5000,
            visible: true
        })
        let startTime = Date.now()
        do {
            await page.click(hamburgerMail)
        } while (!(basicHelper.isElementVisible(hamburgerMail + '+ul'))
            && Date.now() - startTime < 8000)
    },

    async clickHamburgerMailOptions() {
        await page.waitForSelector(hamburgerMailOptions, {
            timeout: 5000,
            visible: true
        })
        let startTime = Date.now()
        do {
            await page.click(hamburgerMailOptions)
        } while (!(basicHelper.isElementVisible(hamburgerMailOptions + '+ul'))
            && Date.now() - startTime < 8000)
    },

    async clickHamburgerSendMail() {
        await page.waitForSelector(hamburgerSendMail, {
            timeout: 5000,
            visible: true
        })
        await page.click(hamburgerSendMail)
    },

    async clickHamburgerGmail() {
        await page.waitForSelector(hamburgerGmail, {
            timeout: 5000,
            visible: true
        })
        let startTime = Date.now()
        do {
            await page.click(hamburgerGmail)
        } while (!(basicHelper.isElementVisible(hamburgerGmail + '+ul'))
            && Date.now() - startTime < 8000)
    },

    async clickHamburgerOtherServers() {
        const selector = hamburgerOtherServers
        await page.waitForSelector(selector, {
            timeout: 5000,
            visible: true
        })
        let startTime = Date.now()
        do {
            await page.click(selector)
        } while (!(basicHelper.isElementVisible(selector + '+ul'))
            && Date.now() - startTime < 8000)
    },

    async clickHamburgerMailSettings() {
        await page.waitForSelector(hamburgerMailSettings, {
            timeout: 5000,
            visible: true
        })
        await page.click(hamburgerMailSettings)
    },

    async clickContextMenuIconForMenu(text) {
        const menu = await page.evaluateHandle((tabMenus, text) => {
            return [...document.querySelectorAll(tabMenus)]
                .filter(el => el.childNodes[0].nodeValue === text)[0]
        }, tabMenus, text)
        await menu.hover()
        await menu.click({ button: 'right' })

        // await basicHelper.waitForNetworkIdle(100)
        // await page.waitForSelector(tabMenuContextIcon, { timeout: 2000 })
        // // await basicHelper.waitForNetworkIdle(200)
        // const menuOptions = await page.evaluateHandle((tabMenuContextIcon, text) => {
        //     return [...document.querySelectorAll(tabMenuContextIcon)]
        //         .filter(el => el.closest('a').childNodes[0].nodeValue === text)[0]
        // }, tabMenuContextIcon, text)
        // await menuOptions.click()
    },

    async clickContextMenuOption(text) {
        await page.waitForSelector(tabMenuContextDialogItems, { timeout: 2000 })
        await basicHelper.clickElementByTextContent(tabMenuContextDialogItems, text)
    }

}