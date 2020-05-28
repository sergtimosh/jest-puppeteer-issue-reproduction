import { ENV_CONFIG } from '../support/data/env_config';
import { basicHelper } from '../support/helpers/BasicHelper';
import { commonFormAssert } from '../support/pages/forms/CommonForm';
import { partAvailabilitySubForm, partCatalogueForm } from '../support/pages/forms/PartCatalogueForm';
import { homePageAssert } from '../support/pages/HomePage';
import { loginPage } from '../support/pages/LoginPage';
import { commonFormMenu } from '../support/pages/menus/CommonFormMenu';
import { mainMenu } from '../support/pages/menus/MainMenu';
import { commonModal } from '../support/pages/modals/CommonModal';
import { commonParameterInputModal, commonParameterInputModalAssert, warehouseParameterInputModal } from '../support/pages/modals/ParameterInputModal';

const url = ENV_CONFIG.URL
const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const partNumber = 'PartNum.' + (Math.random() * 1000).toFixed(3)
const partDescription = 'PartDescr.' + (Math.random() * 1000).toFixed(3)
const partQuantity = 100000
const compName = ENV_CONFIG.COMPANY_NAME

beforeEach(async () => {
    await basicHelper.clearTabs()
    await jestPuppeteer.resetBrowser()
    await loginPage.login(url, userName, password)
    await basicHelper.waitForRequests('/priwcf/service.svc', 'POST', 10)
    await homePageAssert.isSelectedCompany(compName)
})

describe('Create Part', () => {

    test('Create New Part', async () => {
        await mainMenu.selectMainMenuTab('Inventory')
        await mainMenu.selectTabMenu('Parts')
        await mainMenu.selectTabForm('Part Catalogue')
        await commonFormAssert.isBreadCrumbHasText('Part Catalogue')
        await commonFormMenu.switchToTableRecordView()

        //set values and check they are set
        await partCatalogueForm.setPartNumber(partNumber)
        await partCatalogueForm.setPartDescription(partDescription)
        const partStatus = await partCatalogueForm.getPartStatus()
        expect(partStatus).not.toBe('')

        //do Actions with part
        await commonFormMenu.clickActions()
        await commonFormMenu.clickActionsDropdownMenuItem('Adjust Inventory in Warehouse')
        await commonModal.clickOkBtn()
        await commonParameterInputModalAssert.isModalTitle()

        //modify Parameter Input values
        await warehouseParameterInputModal.clickSelectWarehouseIcon()
        await warehouseParameterInputModal.selectOptionFromList('Main')
        await warehouseParameterInputModal.setPartQuantity(partQuantity)
        await commonParameterInputModal.clickButton('OK')

        await commonModal.clickOkBtn()

        //Verify Available Inventory
        await partAvailabilitySubForm.clickTab()
        const availableInventory = await partAvailabilitySubForm.getAvailableInventory()
        expect(availableInventory)
            .toBe(partQuantity
                .toLocaleString('en-US', { minimumFractionDigits: 2 }))
    })

})