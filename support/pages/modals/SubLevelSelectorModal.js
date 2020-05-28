import { basicHelper } from "../../helpers/BasicHelper"

const subLevelMenuItems = '.ListViewerItem'
const subLevelMenuSelectedItem = '.ListViewerItemSelected'

export const subLevelSelectorModal = {

    async selectSubLevelMenu(text) {
        await page.waitForSelector(subLevelMenuItems)
        await expect(page).toClick(subLevelMenuItems, { text: text })
    },

    async confirm() {
        await expect(page)
            .toClick('.html-face', {
                text: 'OK',
                timeout: 5000
            })
    },

    async getItemsList() {
        await page.waitForSelector(subLevelMenuItems, { timeout: 2000 })
        const selectedItem = await basicHelper.getElementsTextArray(subLevelMenuSelectedItem)
        const restOfItems = await basicHelper.getElementsTextArray(subLevelMenuItems)
        return selectedItem.concat(restOfItems)
    }

}