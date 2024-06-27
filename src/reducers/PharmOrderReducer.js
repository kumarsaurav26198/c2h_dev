import * as Actions from '../actions/ActionTypes'
const PharmOrderReducer = (state = { tax_list:[], discount:0, tax:0, sub_total:0, promo:undefined, total:0, delivery_charge:0, cart_items : [], cart_count : undefined, pharm_id:undefined}, action) => {

    switch (action.type) {
        case Actions.ADD_TO_CART:
            return Object.assign({}, state, {
                cart_items:action.data,
                cart_count:Object.keys(action.data).length
            });
        case Actions.UPDATE_PHARM_ID:
            return Object.assign({}, state, {
                pharm_id: action.data
            });
        case Actions.RESET:
            return Object.assign({}, state, {
                pharm_id: undefined,
                discount:0, 
                tax:0, 
                cart_count:undefined, 
                cart_items:[], 
                sub_total:0, 
                promo:undefined, 
                total:0, 
                delivery_charge:0
            });
        case Actions.UPDATE_SUBTOTAL:
            return Object.assign({}, state, {
                sub_total: action.data
            });
        case Actions.UPDATE_PROMO:
            return Object.assign({}, state, {
                promo: action.data
            });
        case Actions.TAX_LIST:
            return Object.assign({}, state, {
                tax_list: action.data
            });
        case Actions.UPDATE_DELIVERY_CHARGE:
            return Object.assign({}, state, {
                delivery_charge: action.data
            });
        case Actions.CALCULATE_TOTAL:
            let promo = state.promo;
            if(!promo){
                let net_total = parseFloat(state.sub_total) + parseFloat(state.delivery_charge);
                let tax = calculate_taxes(state.sub_total,state.tax_list);
                let total = parseFloat(net_total + tax);
                return Object.assign({}, state, {
                    tax: tax, total : total
                });
            }else{
                if(promo.promo_type == 1){
                let subtotal_with_discount = parseFloat(state.sub_total - promo.discount);
                let net_total = parseFloat(subtotal_with_discount) + parseFloat(state.delivery_charge);
                let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                let total = net_total + tax;
                if(total >= 0){
                    return Object.assign({}, state, {
                        tax: tax, total : total, sub_total:state.sub_total, discount:promo.discount
                    });
                }else{
                    alert('Sorry this promo is not valid!')
                    let subtotal_with_discount = parseFloat(state.sub_total);
                    let net_total = parseFloat(subtotal_with_discount) + parseFloat(state.delivery_charge);
                    let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                    let total = net_total + tax;
                    return Object.assign({}, state, {
                        tax: tax, total : total, sub_total:state.sub_total, discount:0, promo:undefined, 
                    });
                }
                }else{
                let discount = (promo.discount /100) * state.sub_total;
                if(discount > promo.max_discount_value){
                    discount = promo.max_discount_value;
                }
                let subtotal_with_discount =  parseFloat(state.sub_total - discount);
                let net_total = parseFloat(subtotal_with_discount) + parseFloat(state.delivery_charge);
                let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                let total = parseFloat(net_total + tax);
                if(total >= 0){
                    return Object.assign({}, state, {
                        tax: tax, total : total, sub_total:state.sub_total, discount:discount
                    });
                }else{
                    alert('Sorry this promo is not valid!')
                    let subtotal_with_discount = parseFloat(state.sub_total);
                    let net_total = parseFloat(subtotal_with_discount) + parseFloat(state.delivery_charge);
                    let tax = calculate_taxes(subtotal_with_discount,state.tax_list);
                    let total = net_total + tax;
                    return Object.assign({}, state, {
                        tax: tax, total : total, sub_total:state.sub_total, discount:0, promo:undefined, 
                    });
                }
                }
            }
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

export default PharmOrderReducer;
