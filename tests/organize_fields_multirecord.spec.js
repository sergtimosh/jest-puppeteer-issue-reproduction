import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { commonFormAssert } from "../support/pages/forms/CommonForm"
import { partCatalogueForm } from "../support/pages/forms/PartCatalogueForm"
import { homePage, homePageAssert } from "../support/pages/HomePage"
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

describe('Organize Form Fields', () => {

    test('Reorder Form Fields', async () => {
        const formName = 'Part Catalogue'
        const defaultFirstColumn = 'Part Number'

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await basicHelper.waitForNetworkIdle(1000)
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToMultiRecordView()

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        const actualDesignList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        console.log(`actual design order list length = ${actualDesignList.length}`)
        console.log(actualDesignList)

        //select field to move
        await formDesignPanel.selectFieldMultirecordByIndex(0) //select first field
        await formDesignPanel.clickMoveDown()
        const reorderedDesignList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        console.log(`reordered design order list length = ${reorderedDesignList.length}`)
        console.log(reorderedDesignList)
        expect(reorderedDesignList).toEqual(dataHelper.createSwappedArray(actualDesignList, 0, 1))
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //assert new fields order
        await partCatalogueForm.waitForMultirecordFieldPositionToBe(0, reorderedDesignList[0]) //wait for changes to apply
        const reorderedFieldsList = await partCatalogueForm.getMultirecordColumnList()
        expect(dataHelper.shortenArray(reorderedFieldsList, 15))
            .toEqual(dataHelper.shortenArray(reorderedDesignList, 15))

        //restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.clickSaveButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.waitSliderIsGone()

        //close form
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.closeScreen()
        await basicHelper.waitForNetworkIdle(300)
        await homePageAssert.isOpenedWindowsNumber(0)
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        //open form again and verify defaults are restored
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        const restoredFormColumnsList = await partCatalogueForm.getMultirecordColumnList()
        console.log(`restored design order list length = ${restoredFormColumnsList.length}`)
        console.log(restoredFormColumnsList)
        expect(restoredFormColumnsList[0]).toEqual(defaultFirstColumn)

    })

    test('Rename Form Fields', async () => {
        const formName = 'Part Catalogue'
        const newFieldName = `Part_${Date.now()}`
        const defaultFirstColumn = 'Part Number'

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await basicHelper.waitForNetworkIdle(1000)
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToMultiRecordView()

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        const actualDesignList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        console.log(`actual design order list length = ${actualDesignList.length}`)
        console.log(actualDesignList)

        //select field to move
        await formDesignPanel.selectFieldMultirecordByIndex(0) //select first field
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Rename')
        await formDesignPanel.renameField(newFieldName)
        await page.keyboard.press('Enter')
        const renamedDesignList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        console.log(`reordered design order list length = ${renamedDesignList.length}`)
        console.log(renamedDesignList)
        expect(renamedDesignList).not.toEqual(actualDesignList)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //assert new fields order
        await partCatalogueForm.waitForMultirecordFieldPositionToBe(0, newFieldName)
        const renamedFieldsList = await partCatalogueForm.getMultirecordColumnList()
        //shorten the arrays
        expect(dataHelper.shortenArray(renamedFieldsList, 15))
            .toEqual(dataHelper.shortenArray(renamedDesignList, 15))
        console.log(renamedFieldsList)
        expect(renamedFieldsList[0]).toEqual(newFieldName)

        //restore defaults
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.clickSettingsIcon()
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.clickSaveButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.waitSliderIsGone()

        //close form
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.closeScreen()
        await basicHelper.waitForNetworkIdle(300)
        await homePageAssert.isOpenedWindowsNumber(0)
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        //open form again and verify defaults are restored
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        const restoredFormColumnsList = await partCatalogueForm.getMultirecordColumnList()
        console.log(`restored design order list length = ${restoredFormColumnsList.length}`)
        console.log(restoredFormColumnsList)
        expect(restoredFormColumnsList[0]).toEqual(defaultFirstColumn)
    })

    test('Hide Form Fields', async () => {
        const formName = 'Part Catalogue'
        const columnName = 'Bar Code'

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await basicHelper.waitForNetworkIdle(1000)
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToMultiRecordView()

        //restore defaults
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsIcon()
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.clickSaveButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.waitSliderIsGone()

        //close form
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.closeScreen()
        await homePageAssert.isOpenedWindowsNumber(0)
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        //open form again and verify defaults are restored
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        let restoredFormColumnsList = await partCatalogueForm.getMultirecordColumnList()
        console.log(`restored design order list length = ${restoredFormColumnsList.length}`)
        console.log(restoredFormColumnsList)
        expect(restoredFormColumnsList[1]).toEqual(columnName)

        //open form design panel
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        const defaultsDesignList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        console.log(`actual design order list length = ${defaultsDesignList.length}`)
        console.log(defaultsDesignList)

        //select field to hide
        await formDesignPanel.selectFieldMultirecordByText(columnName) //select first field
        await formDesignPanel.clickMoreIcon()
        await basicHelper.waitForNetworkIdle(200)
        await formDesignPanel.clickFieldAction('Hide')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        const visibleDesignList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        const hiddenDesignList = await formDesignPanel.getHiddenMultirecordFieldsArray()
        console.log(`edited design order list length = ${visibleDesignList.length}`)
        console.log(visibleDesignList)
        console.log(`hidden fields aray - ${hiddenDesignList}`)
        expect(visibleDesignList).not.toContain(columnName)
        expect(hiddenDesignList).toContain(columnName)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //assert new fields order
        await partCatalogueForm.waitForMultirecordFieldsListEqualTo(visibleDesignList)
        const editedFieldsList = await partCatalogueForm.getMultirecordColumnList()
        //shorten the arrays
        expect(editedFieldsList).not.toContain(columnName)
        expect(dataHelper.shortenArray(editedFieldsList, 15))
            .toEqual(dataHelper.shortenArray(visibleDesignList, 15))
        console.log(editedFieldsList)

        //open form design panel again
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsIcon()
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select hidden field and un-hide
        await formDesignPanel.clickMoreIconForHiddenField(columnName)
        await formDesignPanel.clickFieldAction('Display')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        const actualUnhiddenDesignOrder = await formDesignPanel.getVisibleMultirecordFieldsArray()
        const expectedUnhiddenOrder = dataHelper.createArrayWithElementMovedToTheEnd(defaultsDesignList, 1)
        expect(actualUnhiddenDesignOrder).toEqual(expectedUnhiddenOrder)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //verify field is un-hidden
        await basicHelper.waitForNetworkIdle(1000)
        //scroll right to see if column stays pinned
        await partCatalogueForm.clickPartNumberField()
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('ArrowLeft')
            await basicHelper.waitForNetworkIdle(50)
        }
        const unhiddenFormColumnsList = await partCatalogueForm.getMultirecordColumnList()
        expect(unhiddenFormColumnsList).toContain(columnName)

        //restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.clickSaveButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.waitSliderIsGone()

        //close form
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.closeScreen()
        await homePageAssert.isOpenedWindowsNumber(0)
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        //open form again and verify defaults are restored
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        restoredFormColumnsList = await partCatalogueForm.getMultirecordColumnList()
        console.log(`restored design order list length = ${restoredFormColumnsList.length}`)
        console.log(restoredFormColumnsList)
        expect(restoredFormColumnsList[1]).toEqual(columnName)
    })

    test('Freeze Pane Option', async () => {
        const formName = 'Part Catalogue'
        const defaultPinnedColumnName = 'Part Number'
        const columnName = 'Status'

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await basicHelper.waitForNetworkIdle(1000)
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToMultiRecordView()

        //restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.clickSaveButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.waitSliderIsGone()

        //close form
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.closeScreen()
        await homePageAssert.isOpenedWindowsNumber(0)
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        //open form again and verify defaults are restored
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        let actualPinnedColumnName = await partCatalogueForm.getPinnedColumnText()
        console.log(actualPinnedColumnName)
        expect(actualPinnedColumnName).toEqual(defaultPinnedColumnName)

        //open form design panel
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        const actualDesignList = await formDesignPanel.getVisibleMultirecordFieldsArray()
        console.log(`actual design order list length = ${actualDesignList.length}`)
        console.log(actualDesignList)

        //try to freeze column #6
        await formDesignPanel.selectFieldMultirecordByIndex(5) //select field
        await formDesignPanel.clickMoreIcon()
        let disabledActions = await formDesignPanel.getDisabledOptionsArray()
        expect(disabledActions).toContain('Freeze Pane') //check option is disabled

        //freeze 5th column
        await formDesignPanel.selectFieldMultirecordByIndex(4) //select first field
        await formDesignPanel.clickMoreIcon()
        disabledActions = await formDesignPanel.getDisabledOptionsArray()
        expect(disabledActions).not.toContain('Freeze Pane')
        await formDesignPanel.clickFieldAction('Freeze Pane')

        //check field is pinned
        const actualPinnedDesignField = await formDesignPanel.getPinnedOptionText()
        console.log(`pinned field - ${actualPinnedDesignField}`)
        expect(actualPinnedDesignField).toEqual(columnName)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //assert new pinned field
        await partCatalogueForm.waitForPinnedColumnToBe(columnName)
        actualPinnedColumnName = await partCatalogueForm.getPinnedColumnText()
        console.log(actualPinnedColumnName)
        expect(actualPinnedColumnName).toEqual(columnName)

        //scroll right to see if column stays pinned
        await partCatalogueForm.clickStatusField()
        for (let i = 0; i < 15; i++) {
            await page.keyboard.press('Enter')
            await basicHelper.waitForNetworkIdle(50)
        }
        let collumnslistAfterScroll = await partCatalogueForm.getMultirecordColumnList()
        console.log(collumnslistAfterScroll)
        expect(collumnslistAfterScroll[4]).toEqual(columnName)

        //restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.clickSaveButton()
        await commonModal.clickOkBtn()
        await formDesignPanel.waitSliderIsGone()

        //close form
        await basicHelper.waitForNetworkIdle(500)
        await commonFormMenu.closeScreen()
        await homePageAssert.isOpenedWindowsNumber(0)
        await homePage.waitForHomePage()
        await basicHelper.waitForRequests('__profile', 'PUT', 1)

        //open form again and verify defaults are restored
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        actualPinnedColumnName = await partCatalogueForm.getPinnedColumnText()
        console.log(actualPinnedColumnName)
        expect(actualPinnedColumnName).toEqual(defaultPinnedColumnName)
    })
})