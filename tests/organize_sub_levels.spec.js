import { ENV_CONFIG } from "../support/data/env_config"
import { basicHelper } from "../support/helpers/BasicHelper"
import { dataHelper } from "../support/helpers/DataHelper"
import { commonForm } from "../support/pages/forms/CommonForm"
import { partCatalogueForm } from "../support/pages/forms/PartCatalogueForm"
import { homePageAssert } from "../support/pages/HomePage"
import { loginPage } from "../support/pages/LoginPage"
import { commonFormMenu } from "../support/pages/menus/CommonFormMenu"
import { mainMenu } from "../support/pages/menus/MainMenu"
import { commonModal } from "../support/pages/modals/CommonModal"
import { subLevelSelectorModal } from "../support/pages/modals/SubLevelSelectorModal"
import { formDesignPanel, formDesignPanelAssert } from "../support/pages/panels/FormDesignPanel"

// jest.retryTimes(0)

const URL = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const compName = ENV_CONFIG.COMPANY_NAME

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetPage()
    await page.setViewport({ width: 1900, height: 800 }) //set viewport larger to include more sub-levels
    await loginPage.login(URL, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 8)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Organize Menu Actions', () => {

    test('Reorder Sub-levels', async () => {
        const formName = 'Part Catalogue'
        const designTab = 'Sub-levels'
        const partNumber = ENV_CONFIG.PARTS.PART1.NUMBER

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        //switch to single record view and set data to input
        await commonFormMenu.switchToTableRecordView()
        await partCatalogueForm.setPartNumber(partNumber)
        await basicHelper.waitForNetworkIdle(300)

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab(designTab)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get sub-levels default list
        await basicHelper.waitForNetworkIdle(500)
        const defaultSublevelVisibleList = await commonForm.getVisibleSubformList()
        defaultSublevelVisibleList.splice(0, 1) //remove first element, because it is taken from second sub-level
        await page.keyboard.press('F5')
        const defaultSublevelSelectorModalList = await subLevelSelectorModal.getItemsList()
        await page.keyboard.press('Escape')

        //open form design panel again
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select "Sub-levels" tab
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab(designTab)
        await basicHelper.waitForNetworkIdle(300)
        const defaultDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(defaultDesignFields).toEqual(defaultSublevelSelectorModalList)
        expect(defaultDesignFields).toEqual(expect.arrayContaining(defaultSublevelVisibleList))

        await formDesignPanel.selectFieldMultirecordByIndex(0)
        await formDesignPanel.clickMoveDown()
        await basicHelper.waitForNetworkIdle(300)
        const reorderedDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(reorderedDesignFields).toEqual(dataHelper.moveElementInNewArr(defaultDesignFields, 0, 1))
        console.log(`reordered design actions list -\n ${reorderedDesignFields}`)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //verify changes in the sub-level
        await basicHelper.waitForNetworkIdle(500)
        const newSublevelVisibleList = await commonForm.getVisibleSubformList()
        newSublevelVisibleList.splice(0, 1) //remove first element, because it is taken from second sub-level
        await page.keyboard.press('F5')
        const newSublevelSelectorModalList = await subLevelSelectorModal.getItemsList()
        await page.keyboard.press('Escape')
        expect(newSublevelSelectorModalList).toEqual(dataHelper.moveElementInNewArr(defaultSublevelSelectorModalList, 0, 1))
        expect(newSublevelVisibleList).toEqual(expect.arrayContaining(defaultSublevelVisibleList))

        //open design panel again and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab(designTab)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //verify sub-level is default
        await basicHelper.waitForNetworkIdle(500)
        const restoredSublevelVisibleList = await commonForm.getVisibleSubformList()
        restoredSublevelVisibleList.splice(0, 1) //remove first element, because it is taken from second sub-level
        await page.keyboard.press('F5')
        const restoredSublevelSelectorModalList = await subLevelSelectorModal.getItemsList()
        await page.keyboard.press('Escape')
        expect(restoredSublevelVisibleList).toEqual(defaultSublevelVisibleList)
        expect(restoredSublevelSelectorModalList).toEqual(defaultSublevelSelectorModalList)
    })

    test('Hide Sub-level', async () => {
        const formName = 'Part Catalogue'
        const designTab = 'Sub-levels'
        const partNumber = ENV_CONFIG.PARTS.PART1.NUMBER
        const hideIndex = 0

        //enter form
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm(formName)

        //temporary solution to close error popup
        await commonModal.removeErrorMessage()

        //switch to single record view and set data to input
        await commonFormMenu.switchToTableRecordView()
        await partCatalogueForm.setPartNumber(partNumber)
        await basicHelper.waitForNetworkIdle(500)

        //open form design panel and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab(designTab)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()

        //get sub-levels default list
        await basicHelper.waitForNetworkIdle(500)
        const defaultSublevelVisibleList = await commonForm.getVisibleSubformList()
        defaultSublevelVisibleList.splice(0, 1) //remove first element, because it is taken from second sub-level
        await page.keyboard.press('F5')
        const defaultSublevelSelectorModalList = await subLevelSelectorModal.getItemsList()
        await page.keyboard.press('Escape')

        //open form design panel again
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)

        //select "Sub-levels" tab
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab(designTab)
        await basicHelper.waitForNetworkIdle(300)
        const defaultDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(defaultDesignFields).toEqual(defaultSublevelSelectorModalList)
        expect(defaultDesignFields).toEqual(expect.arrayContaining(defaultSublevelVisibleList))

        await formDesignPanel.selectFieldMultirecordByIndex(hideIndex)
        await formDesignPanel.clickMoreIcon()
        await formDesignPanel.clickFieldAction('Hide')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        const editedDesignFields = await formDesignPanel.getVisibleMultirecordFieldsArray()
        expect(editedDesignFields).toEqual(dataHelper.createSplicedArray(defaultDesignFields, 0, 1))
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //verify changes in Sub-levels (modal and form)
        await basicHelper.waitForNetworkIdle(500)
        const newSublevelVisibleList = await commonForm.getVisibleSubformList()
        newSublevelVisibleList.splice(0, 1) //remove first element, because it is taken from second sub-level
        await page.keyboard.press('F5')
        const newSublevelSelectorModalList = await subLevelSelectorModal.getItemsList()
        await page.keyboard.press('Escape')
        expect(newSublevelVisibleList).not.toContain(defaultSublevelVisibleList[0])
        expect(newSublevelSelectorModalList).toEqual(dataHelper.createSplicedArray(defaultDesignFields, 0, 1))

        //open design panel again and un-hide Sub-level
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab(designTab)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickMoreIconForHiddenField(defaultDesignFields[hideIndex])
        await formDesignPanel.clickFieldAction('Display')
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickFirstRadioButton()
        await basicHelper.waitForNetworkIdle(300)
        const actualUnhiddenDesignOrder = await formDesignPanel.getVisibleMultirecordFieldsArray()
        const expectedUnhiddenOrder = dataHelper.createArrayWithElementMovedToTheEnd(defaultDesignFields, 0)
        expect(actualUnhiddenDesignOrder).toEqual(expectedUnhiddenOrder)
        await formDesignPanel.clickSaveButton()
        await formDesignPanel.waitSliderIsGone()

        //verify tab is un-hidden and is in the end of the list
        await basicHelper.waitForNetworkIdle(1000)
        await page.keyboard.press('F5')
        const unhiddenSublevelSelectorModalList = await subLevelSelectorModal.getItemsList()
        await page.keyboard.press('Escape')
        await commonForm.clickLastTabPaginationIcon()
        await basicHelper.waitForNetworkIdle(200)
        const unhiddenSublevelVisibleList = await commonForm.getVisibleSubformList()
        expect(unhiddenSublevelSelectorModalList).toEqual(expectedUnhiddenOrder)
        expect(unhiddenSublevelVisibleList).toContain(defaultDesignFields[0]) //verify unhidden column is visible on the last page
        
        //open design panel again and restore defaults
        await commonFormMenu.clickSettingsIcon()
        await commonFormMenu.clickSettingsDropdownMenuItem('Organize Fields')
        await formDesignPanelAssert.isTitle(`Form Design - ${formName}`)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.selectMenuTab(designTab)
        await basicHelper.waitForNetworkIdle(300)
        await formDesignPanel.clickRestoreDefaultsButton()
        await formDesignPanel.waitSliderIsGone()
        await commonModal.clickOkBtn()
        
        //verify sub-level is default
        await basicHelper.waitForNetworkIdle(500)
        const restoredSublevelVisibleList = await commonForm.getVisibleSubformList()
        restoredSublevelVisibleList.splice(0, 1) //remove first element, because it is taken from second sub-level
        await page.keyboard.press('F5')
        const restoredSublevelSelectorModalList = await subLevelSelectorModal.getItemsList()
        await page.keyboard.press('Escape')
        expect(restoredSublevelVisibleList).toEqual(defaultSublevelVisibleList)
        expect(restoredSublevelSelectorModalList).toEqual(defaultSublevelSelectorModalList)
    })
})