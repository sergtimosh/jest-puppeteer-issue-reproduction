import { ENV_CONFIG } from "../support/data/env_config"
import { MODAL_MESSAGES } from "../support/data/modalMessages"
import { basicHelper } from "../support/helpers/BasicHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { commonFormAssert } from "../support/pages/forms/CommonForm"
import { partCatalogueForm } from "../support/pages/forms/PartCatalogueForm"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { commonFormMenu } from "../support/pages/menus/CommonFormMenu"
import { mainMenu } from "../support/pages/menus/MainMenu"
import { commonModal, commonModalAssert } from "../support/pages/modals/CommonModal"
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

    test('Verify Search in From Design', async () => {
        const formName = 'Sales Orders'
        //enter form
        await mainMenu.selectMainMenuTab('Sales')
        await mainMenu.selectTabMenu('Orders')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await basicHelper.waitForNetworkIdle(1000)
        await commonModal.removeErrorMessage()

        //open form design panel
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //search column in the panel
        await formDesignPanel.setIntoSearchField('Date')
        await formDesignPanel.waitForSearchResult('Date')
        await formDesignPanel.clickSearchResult('Date')

        //assert column is selected
        await formDesignPanelAssert.isSelectedField('Date')
    })

    test('Reorder Form Fields', async () => {
        const formName = 'Part Catalogue'

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)
        await commonFormAssert.isBreadCrumbHasText(formName)

        //temporary solution to close error popup
        await basicHelper.waitForNetworkIdle(1000)
        await commonModal.removeErrorMessage()

        //switch to single record view
        await commonFormMenu.switchToTableRecordView()

        //select default tab to be selected
        await partCatalogueForm.clickSpecsTab()
        await basicHelper.waitForNetworkIdle(1000)

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 1500)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Part Number', 0)
        const initialLayout = await partCatalogueForm.getMainColumnList() //get default main layout
        const initialTabLayout = await partCatalogueForm.getTabsColumnList() //get default tab layout
        console.log(`initial layout - ${initialLayout}`)

        //open form design panel again
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select and expand tab
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab('Main Columns')
        const initialDesignOrder = await formDesignPanel.getFieldsOrder()
        console.log(`inital order - ${initialDesignOrder}`)
        await formDesignPanel.selectField('Part Number')
        await formDesignPanel.clickMoveDown()
        const changedDesignOrder = await formDesignPanel.getFieldsOrder()
        const swappedInitialDesignOrder = dataHelper.createSwappedArray(initialDesignOrder, 0, 1)
        expect(changedDesignOrder).toEqual(swappedInitialDesignOrder)

        //save
        await formDesignPanel.clickSaveButton()

        //verify changes
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Description', 0) //wait for change to apply
        const changedLayout = await partCatalogueForm.getMainColumnList()
        console.log(`changed layout - ${changedLayout}`)
        const swappedInitialLayout = dataHelper.createSwappedArray(initialLayout, 0, 1)
        expect(changedLayout).not.toEqual(initialLayout) //check order has changed
        expect(changedLayout).toEqual(swappedInitialLayout) //check order has changed

        //change ordering in the tab
        await basicHelper.waitForNetworkIdle(1500)
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab('Specs')
        const initialTabDesignOrder = await formDesignPanel.getFieldsOrder()
        console.log(`inital tab design order - ${initialTabDesignOrder}`)
        await formDesignPanel.selectField('Part Spec 1')
        await formDesignPanel.clickMoveDown()
        const changedTabDesignOrder = await formDesignPanel.getFieldsOrder()
        const swappedInitialTabDesignOrder = dataHelper.createSwappedArray(initialTabDesignOrder, 0, 1)
        expect(changedTabDesignOrder).toEqual(swappedInitialTabDesignOrder)
        await formDesignPanel.clickSaveButton()

        //verify changes
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 2000)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Description', 0) //wait for change to apply
        const changedTabLayout = await partCatalogueForm.getTabsColumnList()
        console.log(`changed tab layout - ${changedTabLayout}`)
        const swappedInitialTabLayout = dataHelper.createSwappedArray(initialTabLayout, 0, 1)
        expect(changedTabLayout).not.toEqual(initialTabLayout) //check order has changed
        expect(changedTabLayout).toEqual(swappedInitialTabLayout) //check order has changed


        //open form design panel and restore defaults
        await basicHelper.waitForNetworkIdle(1000)
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 1500)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Part Number', 0)
        const finalLayout = await partCatalogueForm.getMainColumnList()
        console.log(`final layout - ${finalLayout}`)
        expect(finalLayout).toEqual(initialLayout)
    })

    test('Rename Form Fields', async () => {
        const formName = 'Part Catalogue'
        const newFieldName = 'Part No.'
        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
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
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 1500)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        const initialLayout = await partCatalogueForm.getMainColumnList()

        //open form design panel again
        await commonModal.removeErrorMessage()
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select and expand tab
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab('Main Columns')
        const initialDesignOrder = await formDesignPanel.getFieldsOrder()
        console.log(`inital order = ${initialDesignOrder}`)

        //select field and rename
        await formDesignPanel.selectField('Part Number')
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Rename')
        await formDesignPanel.renameField(newFieldName)
        await page.keyboard.press('Enter')
        const newDesignOrder = await formDesignPanel.getFieldsOrder()
        expect(newDesignOrder[0]).toBe(newFieldName)
        await basicHelper.waitForNetworkIdle(600)
        await formDesignPanel.clickSaveButton()
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Part No.', 0)
        const fieldsList = await partCatalogueForm.getMainColumnList()
        expect(fieldsList[0]).toEqual('Part No.')

        //open form design panel and restore defaults
        await basicHelper.waitForNetworkIdle(600)
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Part Number', 0)
        const finalLayout = await partCatalogueForm.getMainColumnList()
        expect(finalLayout).toEqual(initialLayout)
    })

    test('Hide Form Fields', async () => {
        const formName = 'Part Catalogue'
        const fieldName = 'Part Spec 1'
        const tabName = 'Specs'

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
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
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 2000)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)

        //switch to specs tab
        await partCatalogueForm.clickSpecsTab()
        const initialLayout = await partCatalogueForm.getTabsColumnList()
        console.log(`initialLayout - ${initialLayout}`)

        //open form design panel again
        await commonModal.removeErrorMessage()
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select and expand tab
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab(tabName)
        const initialDesignOrder = await formDesignPanel.getFieldsOrder()
        console.log(`inital order - ${initialDesignOrder}`)

        //select field and hide
        await formDesignPanel.selectField(fieldName)
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Hide')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        let editedDesignOrder = await formDesignPanel.getFieldsOrder()
        console.log(`spliced - ${dataHelper.createSplicedArray(initialDesignOrder, 0, 1)}`)
        console.log(`edited - ${editedDesignOrder}`)
        expect(editedDesignOrder).toEqual(dataHelper.createSplicedArray(initialDesignOrder, 0, 1))
        await formDesignPanel.clickSaveButton()

        // assert new layout is changed accordingly
        await partCatalogueForm.waitForTabFieldsListNotEqualTo(initialLayout)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(initialLayout)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)

        const newLayout = await partCatalogueForm.getTabsColumnList()
        const splicedArray = dataHelper.createSplicedArray(initialLayout, 0, 1)
        console.log(`newLayout - ${newLayout}`)
        console.log(`splicedInitialLayout - ${splicedArray}`)
        expect(newLayout).toEqual(splicedArray)

        //open form design panel again
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsIcon()
        await basicHelper.waitForNetworkIdle(300)
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select and expand tab
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab(tabName)

        //select hidden field and un-hide
        await formDesignPanel.clickMoreIconForHiddenField(fieldName)
        await formDesignPanel.clickFieldAction('Display')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        const actualUnhiddenDesignOrder = await formDesignPanel.getFieldsOrder()
        const expectedUnhiddenOrder = dataHelper.createArrayWithFirstElementMovedToTheEnd(initialDesignOrder)
        expect(actualUnhiddenDesignOrder).toEqual(expectedUnhiddenOrder)
        await formDesignPanel.clickSaveButton()

        //verify option is un-hidden and placed at the end of the form
        await partCatalogueForm.waitForTabFieldsListNotEqualTo(newLayout)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        const unhiddenLayout = await partCatalogueForm.getTabsColumnList()
        expect(unhiddenLayout).toEqual(expectedUnhiddenOrder)

        //open form design panel and restore defaults
        await basicHelper.waitForNetworkIdle(600)
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabFieldsListNotEqualTo(unhiddenLayout)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        const restoredLayout = await partCatalogueForm.getTabsColumnList()
        console.log(`restored Layout - ${restoredLayout}`)
        expect(restoredLayout).toEqual(initialLayout)
    })

    test('Move Column between Tabs', async () => {
        const formName = 'Part Catalogue'
        const fieldName = 'Status'

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
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
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 1500)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Part Number', 0)

        //switch to specs tab
        await partCatalogueForm.clickSpecsTab()
        const initialLayout = await partCatalogueForm.getTabsColumnList()
        console.log(`initialLayout - ${initialLayout}`)

        //open form design panel again
        await commonModal.removeErrorMessage()
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select and expand tab
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab('Main Columns')
        const initialDesignOrder = await formDesignPanel.getFieldsOrder()
        console.log(`inital order - ${initialDesignOrder}`)

        //select field and move
        await formDesignPanel.selectField(fieldName)
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Move to')
        await formDesignPanel.selectColumnToMoveTo('Specs')

        //assert field is moved in design slider and Save
        await basicHelper.waitForNetworkIdle(1500)
        const newDesignOrder = await formDesignPanel.getFieldsOrder()
        expect(newDesignOrder).toContain(fieldName)
        await formDesignPanel.clickSaveButton()

        // assert new layout is changed accordingly
        await partCatalogueForm.waitForTabFieldsListNotEqualTo(initialLayout)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(initialLayout)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        const newLayout = await partCatalogueForm.getTabsColumnList()
        console.log(`newLayout - ${newLayout}`)
        expect(newLayout).toContain(fieldName)

        //open form design panel and restore defaults
        await basicHelper.waitForNetworkIdle(600)
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabFieldsListNotEqualTo(newLayout)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await basicHelper.waitForNetworkIdle(1500)
        const restoredLayout = await partCatalogueForm.getTabsColumnList()
        console.log(`restored Layout - ${restoredLayout}`)
        expect(restoredLayout).toEqual(initialLayout)
    })

    test('Create New Tab', async () => {
        const formName = 'Part Catalogue'
        const fieldName = 'Status'
        const newTabName = `TestTab${Date.now()}`

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
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
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 1500)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await partCatalogueForm.waitForLayoutToHaveValueByColumnIndex('Part Number', 0)

        //get initial tab list
        const initialTablist = await partCatalogueForm.getTabList()

        //open form design panel again
        await commonModal.removeErrorMessage()
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //create new tab
        await formDesignPanel.clickNewTabButton()
        await formDesignPanel.setTabName(newTabName)
        await page.keyboard.press('Enter')
        await formDesignPanelAssert.isActiveTab(newTabName)

        //select and expand main tab
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab('Main Columns')

        //select field and move
        await formDesignPanel.selectField(fieldName)
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Move to')
        await formDesignPanel.selectColumnToMoveTo(newTabName)

        //assert field is moved in design slider and Save
        await basicHelper.waitForNetworkIdle(1500)
        const newDesignOrder = await formDesignPanel.getFieldsOrder()
        expect(newDesignOrder).toContain(fieldName)
        await formDesignPanel.clickSaveButton()

        // assert new tab is present in the form
        await partCatalogueForm.waitForTabListNotEqualTo(initialTablist)
        const newTabsList = await partCatalogueForm.getTabList()
        expect(newTabsList).toContain(newTabName)

        //open form design panel and restore defaults
        await basicHelper.waitForNetworkIdle(600)
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabListNotEqualTo(newTabsList)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        await basicHelper.waitForNetworkIdle(1500)
        const restoredTabs = await partCatalogueForm.getTabList()
        expect(restoredTabs).not.toContain(newTabName)
        expect(restoredTabs).toEqual(initialTablist)
    })

    test('Close Slider without Saving', async () => {

        const formName = 'Part Catalogue'
        const fieldName = 'Part Number'
        const newFieldName = 'Part No.'
        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
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
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        await partCatalogueForm.waitForTabLayoutListLengthToEqualTo(0, 1500)
        await partCatalogueForm.waitForTabFieldsListLengthNotEqualTo(0)
        const initialLayout = await partCatalogueForm.getMainColumnList()

        //open form design panel again
        await commonModal.removeErrorMessage()
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select and expand tab
        await basicHelper.waitForNetworkIdle(1000)
        await formDesignPanel.selectTab('Main Columns')
        const initialDesignOrder = await formDesignPanel.getFieldsOrder()
        console.log(`inital order = ${initialDesignOrder}`)

        //select field and rename
        await formDesignPanel.selectField(fieldName)
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Rename')
        await formDesignPanel.renameField(newFieldName)
        await page.keyboard.press('Enter')
        const newDesignOrder = await formDesignPanel.getFieldsOrder()
        expect(newDesignOrder[0]).toBe(newFieldName)
        await basicHelper.waitForNetworkIdle(600)

        //close slider and verify changes aren't saved
        await formDesignPanel.clickCloseSliderButton()
        await commonModalAssert.isBodyText(MODAL_MESSAGES.EXIT_FORM_DESIGN)
        await commonModal.clickCommonOkButton()
        await commonModal.waitForModalNotVisible()
        await formDesignPanel.waitSliderIsGone()
        await basicHelper.waitForNetworkIdle(3000)
        const fieldsList = await partCatalogueForm.getMainColumnList()
        expect(fieldsList[0]).not.toEqual(newFieldName)
        expect(fieldsList[0]).toEqual(fieldName)
    })
})