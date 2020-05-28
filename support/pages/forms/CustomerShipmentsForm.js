import { basicHelper } from '../../helpers/BasicHelper';
const shipmentStatusInputs = '.inlineManual_DOCUMENTS_D_STATDES'

export const customerShipmentsForm = {

    async setStatus(value, i = 0) {
        console.log(await basicHelper.isElementVisibleByWidth(shipmentStatusInputs, 3000))
        await basicHelper.setFormInputValue(shipmentStatusInputs, value, i)
        const actualValue = await basicHelper.getInputValue(shipmentStatusInputs, i)
        expect(actualValue).toBe(value)
    },

}