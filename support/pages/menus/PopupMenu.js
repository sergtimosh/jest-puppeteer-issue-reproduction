import { basicHelper } from "../../helpers/BasicHelper"

const menu = ".gwt-DecoratedPopupPanel"
const menuItem = ".gwt-DecoratedPopupPanel button"

export const popupMenu = {

    async clickMenuItem(text) {
        await basicHelper.waitForElementVisibleByVisibilityStyle(menu)
        await basicHelper.clickElementByTextContent(menuItem, text)
    }
}