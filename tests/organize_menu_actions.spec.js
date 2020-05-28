import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { commonFormAssert } from "../support/pages/forms/CommonForm"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { commonFormMenu } from "../support/pages/menus/CommonFormMenu"
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

    test('Reorder Actions', async () => {
        const formName = 'Vendors'
        const defaultOuterActionButtons = ['Task Summary for Vendor', 'Chart of Accounts Payable']

        //enter form
        await mainMenu.selectMainMenuTab('Purchasing')
        await mainMenu.selectTabMenu('Vendors')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToTableRecordView()

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get outer actions default list
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const defaultOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const defaultInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        console.log(`default outer actions list - ${defaultOuterActionsMenuList}`)
        console.log(`default inner actions list -\n ${defaultInnerActionsMenuList}`)
        expect(defaultOuterActionsMenuList).toEqual(defaultOuterActionButtons)


        //open form design panel again
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select "Actions" tab
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        await basicHelper.waitForNetworkIdle(300)
        const defaultDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        await formDesignPanel.selectFieldMultirecordByIndex(3)
        await formDesignPanel.clickMoveUp()
        await basicHelper.waitForNetworkIdle(300)
        const reorderedDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(reorderedDesignFields).toEqual(dataHelper.createSwappedArray(defaultDesignFields, 2, 3))
        console.log(`reordered design actions list -\n ${reorderedDesignFields}`)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //verify changes in the Actions menu order
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const newInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        const expectedActionsMenuList = dataHelper.createSwappedArray(defaultInnerActionsMenuList, 0, 1)
        const newOuterActionsMenuList = await commonFormMenu.getOuterActionsArray() //check outer Actions remain unchanged
        expect(newInnerActionsMenuList).toEqual(expectedActionsMenuList)
        expect(newOuterActionsMenuList).toEqual(defaultOuterActionButtons)

        //open design panel again and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get outer actions default list
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const restoredtOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const restoredInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        expect(restoredtOuterActionsMenuList).toEqual(defaultOuterActionButtons)
        expect(restoredInnerActionsMenuList).toEqual(defaultInnerActionsMenuList)
    })

    test('Hide Actions', async () => {
        const formName = 'Contacts'
        const defaultOuterActionButtons = ['Customers', 'Vendors']

        //enter form
        await mainMenu.selectMainMenuTab('Office Management')
        await mainMenu.selectTabMenu('Contacts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToTableRecordView()

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get outer actions default list
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const defaultOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const defaultInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        console.log(`default outer actions list - ${defaultOuterActionsMenuList}`)
        console.log(`default inner actions list -\n ${defaultInnerActionsMenuList}`)
        expect(defaultOuterActionsMenuList).toEqual(defaultOuterActionButtons)

        //open form design panel again
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select "Actions" tab
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        const defaultDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        await formDesignPanel.selectFieldMultirecordByIndex(1)
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Hide')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await formDesignPanel.selectFieldMultirecordByIndex(2)
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Hide')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        const newDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(newDesignFields).not.toContain(defaultDesignFields[1])
        expect(newDesignFields).not.toContain(defaultDesignFields[3])
        console.log(`design actions list with hidden items -\n ${newDesignFields}`)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //verify changes in the Actions menu order
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const newInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        const newOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const concatenatedActionsMenuList = newOuterActionsMenuList.concat(newInnerActionsMenuList)
        expect(concatenatedActionsMenuList).toEqual(newDesignFields)

        //open design panel again and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get outer actions default list
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const restoredtOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const restoredInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        expect(restoredtOuterActionsMenuList).toEqual(defaultOuterActionButtons)
        expect(restoredInnerActionsMenuList).toEqual(defaultInnerActionsMenuList)
    })

    test('Verify Top Two Actions', async () => {
        const formName = 'Contacts'
        const defaultOuterActionButtons = ['Customers', 'Vendors']

        //enter form
        await mainMenu.selectMainMenuTab('Office Management')
        await mainMenu.selectTabMenu('Contacts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToTableRecordView()

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get outer actions default list
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const defaultOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const defaultInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        console.log(`default outer actions list - ${defaultOuterActionsMenuList}`)
        console.log(`default inner actions list -\n ${defaultInnerActionsMenuList}`)
        expect(defaultOuterActionsMenuList).toEqual(defaultOuterActionButtons)


        //open form design panel again
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select "Actions" tab
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        const defaultDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()

        //move outer buttons down
        for (let i = 0; i < 2; i++) {
            await formDesignPanel.selectFieldMultirecordByIndex(0)
            await formDesignPanel.clickMoveDown()
            await formDesignPanel.clickMoveDown()
            await formDesignPanel.clickMoveDown()
        }
        await basicHelper.waitForNetworkIdle(200)
        const newDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        let expectedFieldsOrder = dataHelper.moveElementInNewArr(defaultDesignFields, 0, 3)
        expectedFieldsOrder = dataHelper.moveElementInNewArr(expectedFieldsOrder, 0, 3)
        expect(newDesignFields).toEqual(expectedFieldsOrder)
        console.log(`design actions list with moved items -\n ${newDesignFields}`)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //verify changes in the Actions menu order
        await commonFormMenu.clickActions()
        const newInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        const newOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const concatenatedActionsMenuList = newOuterActionsMenuList.concat(newInnerActionsMenuList)
        expect(newOuterActionsMenuList).toEqual(dataHelper.shortenArray(newDesignFields, 2))
        expect(concatenatedActionsMenuList).toEqual(expectedFieldsOrder)

        //open design panel again and restore defaults
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab('Actions')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get outer actions default list
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickActions()
        const restoredtOuterActionsMenuList = await commonFormMenu.getOuterActionsArray()
        const restoredInnerActionsMenuList = await commonFormMenu.getInnerActionsArray()
        expect(restoredtOuterActionsMenuList).toEqual(defaultOuterActionButtons)
        expect(restoredInnerActionsMenuList).toEqual(defaultInnerActionsMenuList)
    })
})