import { basicHelper } from '../../helpers/BasicHelper';

const partNumberInput = 'input.inlineManual_LOGPART_PARTNAME'
const partDescriptionInput = 'input.inlineManual_LOGPART_PARTDES'
const partStatusInput = 'input.inlineManual_LOGPART_STATDES'
const activeInput = '.priCurrentFieldStyle'
const partCost = '.inlineManual_LOGPART_SECONDPRICE'
const partAvaliabilityTab = '.inlineManual_sb_LOGCOUNTERS'
const availableInventory = '.inlineManual_LOGCOUNTERS_BALANCE'
const detailsTab = '.inlineManual_LOGPART_Details'
const specsTab = '.inlineManual_LOGPART_Specs'
const mainColumnsRootClass = 'inlineManual_th_LOGPART' //part of classname
const mainColumnHeaders = 'tr td.genAreaHeaderStyle #headertext.paintedHeaderTextclass_rtl'
const tabColumnHeadersFirst = 'tr td.tabBorder_ltr+td+td #headertext.paintedHeaderTextclass_rtl'
const tabColumnHeadersSecond = 'tr td.tabBorderStyleNoTab+td+td #headertext.paintedHeaderTextclass_rtl'
const entityTables = '.formTableView_Painted'
const entityTablesMultirecord = 'div.form-table-view'
const tabs = '.PaintedTab'
//selector helpers
const excludeInvisibleTable = 'div.formTableView_Painted:not([style*="display: none"])'
const excludeInvisibleDataTable = '.form-table-view:not([style*="display: none"]) '
const multipleViewColumnHeaders = 'th.formGridHeader_ltr'
const multipleViewPinnedColumn = 'th.formGridHeader_ltr.cover-ltr'

export const partCatalogueForm = {

    //setters
    async setPartNumber(value, i = 0) {
        await page.waitForSelector(partNumberInput, { visible: true })
        await basicHelper.setFormInputValue(partNumberInput, value, i)
        const actualValue = await basicHelper.getInputValue(partNumberInput, i)
        expect(actualValue).toBe(value)
    },

    async setPartDescription(value, i = 0) {
        await page.waitForSelector(partDescriptionInput, { visible: true })
        await basicHelper.setFormInputValue(partDescriptionInput, value, i)
        const actualValue = await basicHelper.getInputValue(partDescriptionInput, i)
        expect(actualValue).toBe(value)
    },

    //getters
    async getPartNumber(i = 0) {
        await page.waitForSelector(partNumberInput, { visible: true })
        return await basicHelper.getInputValue(partNumberInput, i)
    },

    async getPartDescription(i = 0) {
        await page.waitForSelector(partDescriptionInput, { visible: true })
        return await basicHelper.getInputValue(partDescriptionInput, i)
    },

    async getPartStatus(i = 0) {
        await page.waitForSelector(partStatusInput, { visible: true })
        return await basicHelper.getInputValue(partStatusInput, i)
    },

    async getPartCost(i = 0) {
        await page.waitForSelector(partCost, { visible: true })
        return await basicHelper.getInputValue(partCost, i)
    },

    async getMainColumnList() {
        return await page.evaluate((columnHeaders, mainColumnsRootClass, entityTables) => {
            return [...document.querySelectorAll(columnHeaders)]
                .filter(el => el.className.includes(mainColumnsRootClass)
                    && el.closest(entityTables).style.display !== 'none'
                    && el.closest('.paintedHeaderStyle').style.display !== 'none')
                .map(el => el.innerText)
        }, mainColumnHeaders, mainColumnsRootClass, entityTables)
    },

    async getTabsColumnList() {
        const firstColumn = await page.evaluate((columnHeaders, mainColumnsRootClass, entityTables) => {
            return [...document.querySelectorAll(columnHeaders)]
                .filter(el => el.className.includes(mainColumnsRootClass)
                    && el.closest(entityTables).style.display !== 'none'
                    && el.closest('.paintedHeaderStyle').style.display !== 'none')
                .map(el => el.innerText)
        }, tabColumnHeadersFirst, mainColumnsRootClass, entityTables)

        const secondColumn = await page.evaluate((columnHeaders, mainColumnsRootClass, entityTables) => {
            return [...document.querySelectorAll(columnHeaders)]
                .filter(el => el.className.includes(mainColumnsRootClass)
                    && el.closest(entityTables).style.display !== 'none'
                    && el.closest('.paintedHeaderStyle').style.display !== 'none')
                .map(el => el.innerText)
        }, tabColumnHeadersSecond, mainColumnsRootClass, entityTables)

        return firstColumn.concat(secondColumn)
    },

    async getTabList() {
        return await page.evaluate((tabs, entityTables) => {
            return [...document.querySelectorAll(tabs)]
                .filter(el => el.closest(entityTables).style.display !== 'none')
                .map(el => el.innerText)
        }, tabs, entityTables)
    },

    async getMultirecordColumnList() {
        return await page.evaluate((multipleViewColumnHeaders, entityTablesMultirecord) => {
            return [...document.querySelectorAll(multipleViewColumnHeaders)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')
                .map(el => el.textContent)
        }, multipleViewColumnHeaders, entityTablesMultirecord)
    },

    async getPinnedColumnText() {
        return await page.evaluate((multipleViewPinnedColumn, entityTablesMultirecord) => {
            return [...document.querySelectorAll(multipleViewPinnedColumn)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')[0]
                .textContent
        }, multipleViewPinnedColumn, entityTablesMultirecord)
    },

    //actions
    async pressEnterUntillStatusSet(i = 0) {
        let startTime = Date.now()
        let count = 0
        do {
            ++count
            await page.keyboard.press('Enter')
        } while (
            !(await basicHelper.waitForInputNotEmpty(partStatusInput, i))
            && Date.now() - startTime < 8000
        )
        console.log('Clicked in Input = ' + count)
    },

    async clickDetailsTab() {
        const tabButton = await page.waitForSelector(`${excludeInvisibleTable} ${detailsTab}`, { timeout: 2000 })
        await tabButton.click()
        await page.waitForSelector(`${detailsTab}[aria-pressed="true"]`, { visible: true })
    },

    async clickSpecsTab() {
        const tabButton = await page.waitForSelector(`${excludeInvisibleTable} ${specsTab}`, { timeout: 2000 })
        await tabButton.click()
        await page.waitForSelector(`${specsTab}[aria-pressed="true"]`, { timeout: 2000, visible: true })
    },

    async clickStatusField(i = 0) {
        const field = await page.waitForSelector(`${excludeInvisibleDataTable} ${partStatusInput}`, { timeout: 5000 })
        await field.click()
    },

    async clickPartNumberField(i = 0) {
        const field = await page.waitForSelector(`${excludeInvisibleDataTable} ${partNumberInput}`, { timeout: 5000 })
        await field.click()
    },

    //timeouts
    async waitForLayoutToHaveValueByColumnIndex(text, i = 0, timeout = 5000) {
        let isChanged = true
        await page.waitForFunction((text, i, columnHeaders, mainColumnsRootClass, entityTables) =>
            [...document.querySelectorAll(columnHeaders)]
                .filter(el => el.className.includes(mainColumnsRootClass)
                    && el.closest(entityTables).style.display !== 'none'
                    && el.closest('.paintedHeaderStyle').style.display !== 'none')
                .map(el => el.innerText)[i] === text,
            { timeout: timeout }, text, i, mainColumnHeaders, mainColumnsRootClass, entityTables)
            .catch(() => {
                isChanged = false
            })
        console.log(`Layout is changed- ${isChanged}`)
        return isChanged
    },

    async waitForTabFieldsListNotEqualTo(arr, timeout = 5000) {
        let isChanged = true
        await page.waitForFunction((arr, tabColumnHeadersFirst, tabColumnHeadersSecond, mainColumnsRootClass, entityTables) =>
            JSON.stringify([...document.querySelectorAll(tabColumnHeadersFirst)]
                .filter(el => el.className.includes(mainColumnsRootClass)
                    && el.closest(entityTables).style.display !== 'none'
                    && el.closest('.paintedHeaderStyle').style.display !== 'none')
                .map(el => el.innerText).concat(
                    [...document.querySelectorAll(tabColumnHeadersSecond)]
                        .filter(el => el.className.includes(mainColumnsRootClass)
                            && el.closest(entityTables).style.display !== 'none'
                            && el.closest('.paintedHeaderStyle').style.display !== 'none')
                        .map(el => el.innerText)
                )) !== JSON.stringify(arr)
            , { timeout: timeout }, arr, tabColumnHeadersFirst, tabColumnHeadersSecond, mainColumnsRootClass, entityTables)
            .catch(() => {
                isChanged = false
            })
        console.log(`Tab Layout is changed- ${isChanged}`)
        return isChanged
    },

    async waitForTabListNotEqualTo(arr, timeout = 5000) {
        let isChanged = true
        await page.waitForFunction((arr, tabs, entityTables) =>
            JSON.stringify([...document.querySelectorAll(tabs)]
                .filter(el => el.closest(entityTables).style.display !== 'none')
                .map(el => el.innerText)
            ) !== JSON.stringify(arr)
            , { timeout: timeout }, arr, tabs, entityTables)
            .catch(() => {
                isChanged = false
            })
        console.log(`Tab Layout is changed- ${isChanged}`)
        return isChanged
    },

    async waitForTabFieldsListLengthNotEqualTo(length, timeout = 5000) {
        let isNotEqual = true
        await page.waitForFunction((length, tabColumnHeadersFirst, tabColumnHeadersSecond, mainColumnsRootClass, entityTables) =>
            [...document.querySelectorAll(tabColumnHeadersFirst)]
                .filter(el => el.className.includes(mainColumnsRootClass)
                    && el.closest(entityTables).style.display !== 'none'
                    && el.closest('.paintedHeaderStyle').style.display !== 'none')
                .map(el => el.innerText).concat(
                    [...document.querySelectorAll(tabColumnHeadersSecond)]
                        .filter(el => el.className.includes(mainColumnsRootClass)
                            && el.closest(entityTables).style.display !== 'none'
                            && el.closest('.paintedHeaderStyle').style.display !== 'none')
                        .map(el => el.innerText)
                ).length !== length
            , { timeout: timeout }, length, tabColumnHeadersFirst, tabColumnHeadersSecond, mainColumnsRootClass, entityTables)
            .catch(() => {
                isNotEqual = false
            })
        console.log(`Tab Layout List Length is Not Equal to ${length} - ${isNotEqual}`)
        return isNotEqual
    },

    async waitForTabLayoutListLengthToEqualTo(length, timeout = 5000) {
        let isEqual = true
        await page.waitForFunction((length, tabColumnHeadersFirst, tabColumnHeadersSecond, mainColumnsRootClass, entityTables) =>
            [...document.querySelectorAll(tabColumnHeadersFirst)]
                .filter(el => el.className.includes(mainColumnsRootClass)
                    && el.closest(entityTables).style.display !== 'none'
                    && el.closest('.paintedHeaderStyle').style.display !== 'none')
                .map(el => el.innerText).concat(
                    [...document.querySelectorAll(tabColumnHeadersSecond)]
                        .filter(el => el.className.includes(mainColumnsRootClass)
                            && el.closest(entityTables).style.display !== 'none'
                            && el.closest('.paintedHeaderStyle').style.display !== 'none')
                        .map(el => el.innerText)
                ).length === length
            , { timeout: timeout }, length, tabColumnHeadersFirst, tabColumnHeadersSecond, mainColumnsRootClass, entityTables)
            .catch(() => {
                isEqual = false
            })
        console.log(`Tab Layout List Length is Equal to ${length} - ${isEqual}`)
        return isEqual
    },

    async waitForMultirecordFieldsListNotEqualTo(arr, timeout = 5000) {
        let isNotEqual = true
        await page.waitForFunction((arr, multipleViewColumnHeaders, entityTablesMultirecord) =>
            [...document.querySelectorAll(multipleViewColumnHeaders)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')
                .map(el => el.textContent).splice(0, 15) !== arr.splice(0, 15)
            , { timeout: timeout }, arr, multipleViewColumnHeaders, entityTablesMultirecord)
            .catch(() => {
                isNotEqual = false
            })
        console.log(`Multirecord list is not equal to given array - ${isNotEqual}`)
        return isNotEqual
    },

    async waitForMultirecordFieldsListEqualTo(arr, timeout = 5000) {
        let isEqual = true
        await page.waitForFunction((arr, multipleViewColumnHeaders, entityTablesMultirecord) => {
            let resultArr = [...document.querySelectorAll(multipleViewColumnHeaders)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')
                .map(el => el.textContent)
            let arr1 = Array.from(arr)
            arr1.splice(15, arr1.length)
            resultArr.splice(15, resultArr.length)
            return arr1.toString() === resultArr.toString()
        }, { timeout: timeout }, arr, multipleViewColumnHeaders, entityTablesMultirecord)
            .catch(() => {
                isEqual = false
            })
        console.log(`Multirecord list is equal to given array - ${isEqual}`)
        return isEqual
    },

    async waitForMultirecordFieldsListLengthNotEqualTo(length, timeout = 5000) {
        let isNotEqual = true
        await page.waitForFunction((multipleViewColumnHeaders, entityTablesMultirecord) =>
            [...document.querySelectorAll(multipleViewColumnHeaders)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')
                .map(el => el.textContent).length !== length
            , { timeout: timeout }, multipleViewColumnHeaders, entityTablesMultirecord)
            .catch(() => {
                isNotEqual = false
            })
        console.log(`Multirecord list length is not equal to given length - ${isNotEqual}`)
        return isNotEqual
    },

    async waitForMultirecordFieldsListLengthEqualTo(length, timeout = 5000) {
        let isEqual = true
        await page.waitForFunction((multipleViewColumnHeaders, entityTablesMultirecord) =>
            [...document.querySelectorAll(multipleViewColumnHeaders)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')
                .map(el => el.textContent).length === length
            , { timeout: timeout }, multipleViewColumnHeaders, entityTablesMultirecord)
            .catch(() => {
                isEqual = false
            })
        console.log(`Multirecord list length is equal to given length - ${isEqual}`)
        return isEqual
    },

    async waitForMultirecordFieldPositionToBe(i, text, timeout = 5000) {
        let isEqual = true
        await page.waitForFunction((i, text, multipleViewColumnHeaders, entityTablesMultirecord) =>
            [...document.querySelectorAll(multipleViewColumnHeaders)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')
                .map(el => el.textContent)[i] === text
            , { timeout: timeout }, i, text, multipleViewColumnHeaders, entityTablesMultirecord)
            .catch(() => {
                isEqual = false
            })
        console.log(`Multirecord list field name is equal to given - ${isEqual}`)
        return isEqual
    },

    async waitForPinnedColumnToBe(text, timeout = 5000) {
        let isEqual = true
        await page.waitForFunction((text, multipleViewPinnedColumn, entityTablesMultirecord) =>
            [...document.querySelectorAll(multipleViewPinnedColumn)]
                .filter(el => el.closest(entityTablesMultirecord)
                    && el.closest(entityTablesMultirecord).style.display !== 'none')
                .map(el => el.textContent)[0] === text
            , { timeout: timeout }, text, multipleViewPinnedColumn, entityTablesMultirecord)
            .catch(() => {
                isEqual = false
            })
        console.log(`pinned column is ${text} - ${isEqual}`)
        return isEqual
    }

}

export const partAvailabilitySubForm = {

    async clickTab() {
        await page.waitForSelector(partAvaliabilityTab, { visible: true })
        await expect(page).toClick(partAvaliabilityTab, { timeout: 2000 })
    },

    async getAvailableInventory(i = 0) {
        await page.waitForSelector(availableInventory, { visible: true })
        await basicHelper.waitForInputNotZero(availableInventory, i)
        return await basicHelper.getInputValue(availableInventory, i)
    }
}