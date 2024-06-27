import * as ActionTypes from './ActionTypes';

export const updatePrescriptionId = (data) => ({
    type: ActionTypes.UPDATE_PRESCRIPTION_ID,
    data: data
})

export const updatePrescriptionDetails = (data) => ({
    type: ActionTypes.UPDATE_PRESCRIPTION_DETAILS,
    data: data
})
