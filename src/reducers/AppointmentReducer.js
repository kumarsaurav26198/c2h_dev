import * as Actions from '../actions/ActionTypes'
const AppointmentReducer = (state = { payment_mode : undefined}, action) => {

    switch (action.type) {
        case Actions.UPDATE_PAYMENT_MODE:
            return Object.assign({}, state, {
                payment_mode: action.data
            });
        default:
            return state;
    }
}

export default AppointmentReducer;
