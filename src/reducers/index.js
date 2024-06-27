import { combineReducers } from 'redux';
import CurrentAddressReducer from './CurrentAddressReducer.js';
import AppointmentReducer from './AppointmentReducer.js';
import PharmOrderReducer from './PharmOrderReducer.js';
import LabOrderReducer from './LabOrderReducer.js';
import PrescriptionOrderReducer from './PrescriptionOrderReducer.js';

const allReducers = combineReducers({
  current_location:CurrentAddressReducer,
  appointment:AppointmentReducer,
  order:PharmOrderReducer,
  lab_order:LabOrderReducer,
  prescription_order:PrescriptionOrderReducer,
});

export default allReducers;