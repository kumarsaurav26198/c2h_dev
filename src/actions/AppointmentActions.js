import * as ActionTypes from './ActionTypes';

export const updatePaymentMode = (data) => ({
    type: ActionTypes.UPDATE_PAYMENT_MODE,
    data: data
})