import * as ActionTypes from './ActionTypes';

export const addToCart = (data) => ({
    type: ActionTypes.ADD_TO_CART,
    data: data
})

export const updatePharmId = (data) => ({
    type: ActionTypes.UPDATE_PHARM_ID,
    data: data
})

export const reset = () => ({
    type: ActionTypes.RESET,
})

export const updateSubtotal = (data) => ({
    type: ActionTypes.UPDATE_SUBTOTAL,
    data: data
})

export const updatePromo = (data) => ({
    type: ActionTypes.UPDATE_PROMO,
    data: data
})

export const calculateTotal = () => ({
    type: ActionTypes.CALCULATE_TOTAL,
})

export const updateTaxList = (data) => ({
    type: ActionTypes.TAX_LIST,
    data: data
})

export const updateDeliveryCharge = (data) => ({
    type: ActionTypes.UPDATE_DELIVERY_CHARGE,
    data: data
})