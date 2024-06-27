import * as ActionTypes from './ActionTypes';

export const updateAddress = (data) => ({
    type: ActionTypes.UPDATE_ADDRESS,
    data: data
})

export const updateLabs = (data) => ({
    type: ActionTypes.UPDATE_LABS,
    data: data 
})

export const updateLabId = (data) => ({
    type: ActionTypes.UPDATE_LAB_ID,
    data: data 
})

export const updateCurrentLabId = (data) => ({
    type: ActionTypes.UPDATE_CURRENT_LAB_ID,
    data: data 
})

export const updateLabAddToCart = (data) => ({
    type: ActionTypes.UPDATE_LAB_ADD_TO_CART,
    data: data
})

export const updateLabSubTotal = (data) => ({
    type: ActionTypes.UPDATE_LAB_SUBTOTAL,
    data: data
})

export const updateLabPromo = (data) => ({
    type: ActionTypes.UPDATE_LAB_PROMO,
    data: data
})

export const updateLabCalculateTotal = () => ({
    type: ActionTypes.UPDATE_LAB_CALCULATE_TOTAL,
})

export const updateLabTotal = (data) => ({
    type: ActionTypes.UPDATE_LAB_TOTAL,
    data: data
})

export const updateLabDiscount = (data) => ({
    type: ActionTypes.UPDATE_LAB_DISCOUNT,
    data: data
})

export const updateLabTaxList = (data) => ({
    type: ActionTypes.UPDATE_LAB_TAX_LIST,
    data: data
})

export const updateLabTax = (data) => ({
    type: ActionTypes.UPDATE_LAB_TAX,
    data: data
})

export const updateLabPatientName = (data) => ({
    type: ActionTypes.UPDATE_LAB_PATIENT_NAME,
    data: data
})

export const updateLabPatientDob = (data) => ({
    type: ActionTypes.UPDATE_LAB_PATIENT_DOB,
    data: data
})

export const updateLabPatientGenderId = (data) => ({
    type: ActionTypes.UPDATE_LAB_PATIENT_GENDER_ID,
    data: data
})

export const updateLabPatientGenderName = (data) => ({
    type: ActionTypes.UPDATE_LAB_PATIENT_GENDER_NAME,
    data: data
})

export const updateLabPatientPaymentMode = (data) => ({
    type: ActionTypes.UPDATE_LAB_PATIENt_PAYMENT_MODE,
    data: data
}) 

export const labReset = () => ({
    type: ActionTypes.LAB_RESET,
})




