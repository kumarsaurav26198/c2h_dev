import * as Actions from '../actions/ActionTypes'
const PrescriptionOrderReducer = (state = { prescription_details : [], prescription_id:undefined }, action) => {

    switch (action.type) {
        case Actions.UPDATE_PRESCRIPTION_ID:
            return Object.assign({}, state, {
                prescription_id: action.data
            });
        case Actions.UPDATE_PRESCRIPTION_DETAILS:
            return Object.assign({}, state, {
                prescription_details: action.data
            });
        default:
            return state;
    }
}

export default PrescriptionOrderReducer;
