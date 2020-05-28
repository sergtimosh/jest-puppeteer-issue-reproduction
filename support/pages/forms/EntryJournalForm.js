const sumInputs = '.inlineManual_FNCTRANS_SUM1'
import { basicHelper } from '../../helpers/BasicHelper';

export const entryJournalForm = {

    async getSum(i = 0) {
        await basicHelper.isElementVisibleByWidth(sumInputs)
        await basicHelper.waitForInputNotEmpty(sumInputs, i)
        return await basicHelper.getInputValue(sumInputs, i)
    }
}