import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { mainMenu } from "../support/pages/menus/MainMenu"
import { commonModal } from "../support/pages/modals/CommonModal"
import { formDesignPanel, formDesignPanelAssert } from "../support/pages/panels/FormDesignPanel"

// jest.retryTimes(0)

const URL = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetPage()
    await loginPage.login(URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 8)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Organize Menu Actions', () => {
    const menuTab = 'Sales'
    const tabMenu = 'Orders'

    test('Reorder Main Menu Items', async () => {
        await mainMenu.selectMainMenuTab(menuTab)
        await basicHelper.waitForNetworkIdle(400)
        await mainMenu.clickContextMenuIconForMenu(tabMenu)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuOption('Design Menu')

        //verify Design Menu is opened
        await formDesignPanelAssert.isTitle(`Design Menu - ${tabMenu}`)
        await basicHelper.waitForNetworkIdle(200)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get default menu content
        await mainMenu.selectMainMenuTab(menuTab)
        await mainMenu.selectTabMenu(tabMenu)
        const defaultMenuList = await mainMenu.getLastMenuList()
        console.log(defaultMenuList)

        //open menu design again
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuIconForMenu(tabMenu)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuOption('Design Menu')

        //move last item to top
        const modifiedExpectedMenuList = dataHelper.moveElementInNewArr(defaultMenuList, defaultMenuList.length - 1, 0)
        await formDesignPanelAssert.isTitle(`Design Menu - ${tabMenu}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectFieldMultirecordByIndex(defaultMenuList.length - 1) //select last item
        await formDesignPanel.clickMoveToTop()
        await basicHelper.waitForNetworkIdle(200)
        const editedDesignMenuList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        console.log(editedDesignMenuList)
        expect(editedDesignMenuList).toEqual(modifiedExpectedMenuList) //compare expected to actual design
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()
        await basicHelper.waitForNetworkIdle(200)

        //select another manu tab to apply changes on UI
        await mainMenu.selectMainMenuTab('CRM')
        await basicHelper.waitForNetworkIdle(200)

        //verify changes are applied in the menu
        await mainMenu.selectMainMenuTab(menuTab)
        await mainMenu.selectTabMenu(tabMenu)
        const actualMenuList = await mainMenu.getLastMenuList()
        expect(actualMenuList).toEqual(modifiedExpectedMenuList)

        //open menu design and restore defaults
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuIconForMenu(tabMenu)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuOption('Design Menu')
        await formDesignPanelAssert.isTitle(`Design Menu - ${tabMenu}`)
        await basicHelper.waitForNetworkIdle(200)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        await basicHelper.waitForNetworkIdle(200)

        //select another manu tab to apply changes on UI
        await mainMenu.selectMainMenuTab('CRM')
        await basicHelper.waitForNetworkIdle(200)

        //verify defaults are restored
        await mainMenu.selectMainMenuTab(menuTab)
        await mainMenu.selectTabMenu(tabMenu)
        const restoredMenuList = await mainMenu.getLastMenuList()
        expect(restoredMenuList).toEqual(defaultMenuList)
    })

    test('Hide Main Menu Items', async () => {
        await mainMenu.selectMainMenuTab(menuTab)
        await basicHelper.waitForNetworkIdle(400)
        await mainMenu.clickContextMenuIconForMenu(tabMenu)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuOption('Design Menu')

        //verify Design Menu is opened
        await formDesignPanelAssert.isTitle(`Design Menu - ${tabMenu}`)
        await basicHelper.waitForNetworkIdle(200)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get default menu content
        await mainMenu.selectMainMenuTab(menuTab)
        await mainMenu.selectTabMenu(tabMenu)
        const defaultMenuList = await mainMenu.getLastMenuList()
        console.log(defaultMenuList)

        //open menu design again
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuIconForMenu(tabMenu)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuOption('Design Menu')

        //move last item to top
        const index = Math.floor(defaultMenuList.length / 2)
        console.log(`index - ${index}`)
        const modifiedExpectedMenuList = dataHelper.createSplicedArray(defaultMenuList, index, 1)
        await formDesignPanelAssert.isTitle(`Design Menu - ${tabMenu}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectFieldMultirecordByIndex(index) //select some mid item
        await formDesignPanel.clickMoreIcon()
        await basicHelper.waitForNetworkIdle(200)
        await formDesignPanel.clickFieldAction('Hide')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        const editedDesignMenuList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(editedDesignMenuList).toEqual(modifiedExpectedMenuList) //compare expected to actual design
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()
        await basicHelper.waitForNetworkIdle(200)

        //select another manu tab to apply changes on UI
        await mainMenu.selectMainMenuTab('CRM')
        await basicHelper.waitForNetworkIdle(200)

        //verify changes are applied in the menu
        await mainMenu.selectMainMenuTab(menuTab)
        await mainMenu.selectTabMenu(tabMenu)
        const actualMenuList = await mainMenu.getLastMenuList()
        expect(actualMenuList).toEqual(modifiedExpectedMenuList)

        //open menu design and unhide hidden item
        const unhiddendExpectedMenuList = dataHelper.createArrayWithElementMovedToTheEnd(defaultMenuList, index)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuIconForMenu(tabMenu)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuOption('Design Menu')
        await formDesignPanelAssert.isTitle(`Design Menu - ${tabMenu}`)
        await basicHelper.waitForNetworkIdle(200)
        await formDesignPanel.clickMoreIconForSingleHiddenField()
        await formDesignPanel.clickFieldAction('Display')
        await formDesignPanel.clickFirstRadioButton()
        const unhiddenDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(unhiddenDesignFields).toEqual(unhiddendExpectedMenuList)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()
        await basicHelper.waitForNetworkIdle(200)

        //assert actual menu options order after unhide action
        await mainMenu.selectMainMenuTab('CRM')
        await basicHelper.waitForNetworkIdle(200)
        await mainMenu.selectMainMenuTab(menuTab)
        await mainMenu.selectTabMenu(tabMenu)
        const unhiddenMenuList = await mainMenu.getLastMenuList()
        expect(unhiddenMenuList).toEqual(unhiddendExpectedMenuList)

        //restore defaults
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuIconForMenu(tabMenu)
        await basicHelper.waitForNetworkIdle(300)
        await mainMenu.clickContextMenuOption('Design Menu')
        await formDesignPanelAssert.isTitle(`Design Menu - ${tabMenu}`)
        await basicHelper.waitForNetworkIdle(200)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //verify defaults are actually restored
        await mainMenu.selectMainMenuTab('CRM')
        await basicHelper.waitForNetworkIdle(200)
        await mainMenu.selectMainMenuTab(menuTab)
        await mainMenu.selectTabMenu(tabMenu)
        const restoredMenuList = await mainMenu.getLastMenuList()
        expect(restoredMenuList).toEqual(defaultMenuList)
    })
})