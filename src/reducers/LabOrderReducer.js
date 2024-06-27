import * as Actions from '../actions/ActionTypes'
const OrderReducer = (state = { labs:[], current_lab_id:undefined, address:undefined, lab_id:undefined, sub_total:0, promo:undefined, cart_items:[], total:0, cart_count:undefined, discount:0, tax:0, tax_list:[], patient_name:undefined, patient_dob:undefined, patient_gender_id:undefined, patient_gender_name:undefined, payment_mode:0}, action) => {
    switch (action.type) {
        case Actions.UPDATE_ADDRESS:
            return Object.assign({}, state, {
               address: action.data
            });
        case Actions.UPDATE_LABS:
            return Object.assign({}, state, {
               labs: action.data
            });
        case Actions.UPDATE_LAB_ID:
            return Object.assign({}, state, {
               lab_id: action.data
            });
        case Actions.UPDATE_CURRENT_LAB_ID:
            return Object.assign({}, state, {
               current_lab_id: action.data
            });
        case Actions.UPDATE_LAB_ADD_TO_CART:
            return Object.assign({}, state, {
               cart_items: action.data,
               cart_count : Object.keys(action.data).length
            });
        case Actions.UPDATE_LAB_SUBTOTAL:
            return Object.assign({}, state, {
               sub_total: action.data
            });
        case Actions.UPDATE_LAB_TOTAL:
            return Object.assign({}, state, {
               total: action.data
            });
        case Actions.UPDATE_LAB_PROMO:
            return Object.assign({}, state, {
               promo: action.data
            });
        case Actions.UPDATE_LAB_DISCOUNT:
            return Object.assign({}, state, {
               discount: action.data
            });
        case Actions.UPDATE_LAB_TAX:
            return Object.assign({}, state, {
               tax: action.data
            });
        case Actions.UPDATE_LAB_TAX_LIST:
            return Object.assign({}, state, {
               tax_list: action.data
            });
        case Actions.LAB_RESET:
            return Object.assign({}, state, {
              lab_id: undefined,
              discount:0, 
              cart_count:undefined, 
              cart_items:[], 
              sub_total:0, 
              promo:undefined, 
              total:0,
              patient_name:undefined,
              patient_dob:undefined,
              patient_gender:undefined,
              patient_gender_id:undefined,
              address_id:undefined,
              promo_id:undefined,
              discount:0,
              tax:0,
              sub_total:0,
              total:0,
              cart_items:[],
              payment_mode:0,
            });
        case Actions.UPDATE_LAB_CALCULATE_TOTAL:
            let promo = state.promo;
            if(!promo){
              let net_total = parseFloat(state.sub_total);
              let tax = calculate_taxes(state.sub_total,state.tax_list);
              let total = parseFloat(net_total + tax);
              return Object.assign({}, state, {
                 tax: tax, total : total
              });
            }else{
                if(promo.promo_type == 1){
                    let subtotal_with_discount = parseFloat(state.sub_total - promo.discount);
                    let net_total = parseFloat(subtotal_with_discount);
                    let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                    let total = net_total + tax;
                    if(total >= 0){
                      return Object.assign({}, state, {
                         tax: tax, total : total, sub_total:state.sub_total, discount:promo.discount
                      });
                    }else{
                      alert('Sorry this promo is not valid!')
                    }
                  }else{
                    let discount = (promo.discount /100) * state.sub_total;
                    if(discount > promo.max_discount_value){
                      discount = promo.max_discount_value;
                    }
                    let subtotal_with_discount =  parseFloat(state.sub_total - discount);
                    let net_total = parseFloat(subtotal_with_discount);
                    let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                    let total = parseFloat(net_total + tax);
                    if(total >= 0){
                      return Object.assign({}, state, {
                         tax: tax, total : total, sub_total:state.sub_total, discount:discount
                      });
                    }else{
                      alert('Sorry this promo is not valid!')
                    }
                  }
            }

        case Actions.UPDATE_LAB_PATIENT_NAME:
            return Object.assign({}, state, {
               patient_name: action.data
            });
        case Actions.UPDATE_LAB_PATIENT_DOB:
            return Object.assign({}, state, {
               patient_dob: action.data
            });
        case Actions.UPDATE_LAB_PATIENT_GENDER_ID:
            return Object.assign({}, state, {
               patient_gender_id: action.data
            });
        case Actions.UPDATE_LAB_PATIENT_GENDER_NAME:
            return Object.assign({}, state, {
               patient_gender_name: action.data
            });
        case Actions.UPDATE_LAB_PATIENt_PAYMENT_MODE:
            return Object.assign({}, state, {
               payment_mode: action.data
            }); 
 
        default:
            return state;
    }
}

const calculate_taxes = (net_total,tax_list) =>{
  let tax = 0;
  if(tax_list.count == 0){
    return tax;
  }else{
    tax_list.forEach(function(value) {
        let percentage = (net_total /100) * parseFloat(value.percentage);
        tax = tax + percentage;
    });
    return tax;
  }
}

export default OrderReducer;

