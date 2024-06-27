import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, discount, img_url, other_charges, api_url, create_pharmacy_order, promo_apply } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';
import { connect } from 'react-redux';
import { updatePromo, calculateTotal, updatePharmId, addToCart, updateSubtotal, updateTaxList, updateDeliveryCharge } from '../actions/PharmOrderActions';
import UIStepper from 'react-native-ui-stepper';
import axios from 'axios';
import Loader  from '../components/Loader';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PharmCart = (props) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getTaxList(); 
      console.log(props.address);
    }); 
    return unsubscribe;
    
  },[]);

  const getTaxList = async() =>{ 
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + other_charges,
      data:{ service_id:3 }
    })
    .then(async response => {
      setLoading(false);
      await props.updateTaxList(response.data.result);
      props.calculateTotal();
    })
    .catch(error => {
      setLoading(false);
      console.log(error)
      alert('Sorry something went wrong');
    });
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const payment_methods = () => {
    navigation.navigate("PaymentMethods")
  }

  const add_to_cart = async (qty,item_id,item_name,price,item_image,unit) => {
    let cart_items = await props.cart_items;
    let old_item_details = await cart_items[props.cart_items.findIndex(x => x.product_id == item_id)];
    let sub_total = await parseFloat(props.sub_total);
    let total_price = await parseFloat(qty * price);
    
    if(old_item_details != undefined && total_price > 0){
      console.log('1')
      sub_total = await parseFloat(sub_total) - parseFloat(old_item_details.price);
      console.log(sub_total)
    }
    
    if(total_price > 0){
      console.log('2')
      sub_total = await parseFloat(sub_total) + parseFloat(total_price);
      console.log(sub_total)
    }

    console.log('3')
    console.log(sub_total)

      if(qty > 0){
        let item = {
          product_id: item_id,
          product_name: item_name,
          qty: qty,
          unit: unit,
          price_per_item: parseFloat(price),
          price:parseFloat(qty * price),
          image:item_image 
        }
        cart_items[props.cart_items.findIndex(x => x.product_id == item_id)] = await item;
        const st_items = cart_items.filter(el => Object.keys(el).length);
        await store_data(st_items,sub_total.toFixed(2))
        await props.addToCart(st_items);
        await props.updateSubtotal(sub_total);
        await props.calculateTotal();
      }else{
        console.log(cart_items[props.cart_items.findIndex(x => x.product_id == item_id)]);
        delete cart_items[props.cart_items.findIndex(x => x.product_id == item_id)];
        const st_items = cart_items.filter(el => Object.keys(el).length);
        sub_total = parseFloat(sub_total) - parseFloat(price);
        await store_data(st_items,sub_total.toFixed(2))
        await props.addToCart(st_items);
        await props.updateSubtotal(sub_total);
        await props.calculateTotal();
        if(sub_total == 0){
          await navigation.goBack()
      }
    }   
  }

  const store_data = async(cart_items,sub_total) =>{
    try{
        await AsyncStorage.setItem('cart_items', JSON.stringify(cart_items));
        await AsyncStorage.setItem('sub_total', sub_total.toString());
    }catch (e) {
        alert(e);
    }
  }


  const place_order = async() =>{
    let data = {
      customer_id:global.id,
      vendor_id:props.pharm_id,
      total:props.total,
      discount:props.discount,
      promo_id:props.promo ? props.promo.id : 0,
      sub_total:props.sub_total,
      address_id:props.address.id,
      items:JSON.stringify(Object.values(props.cart_items))
    }
    navigation.navigate("PaymentMethods", { type : 2, amount : props.total, data:data, route:create_pharmacy_order, from:'pharm_cart' });
  }

  const promo_code = () => {
    navigation.navigate("PromoCode",{ from : 'cart'});
  }

  const change_address = () =>{
    navigation.navigate("AddressList", { from : 'cart'} )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <ScrollView style={{ padding:10 }} showsVerticalScrollIndicator={false}>
        <View style={{ width:'100%', flexDirection:'row' }}>
          <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Your Items</Text>
          <View style={{ margin:3 }}/>
          <Icon type={Icons.Ionicons} name="cart" style={{ fontSize:20, color:colors.theme_fg_two}} />
        </View>
        <View style={{ margin:10 }}/>
        {props.cart_items.map((row, index) => (
          <View style={{ paddingBottom:20, padding:10, flexDirection:'row' }}> 
            <View style={{ width:'20%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
              <View style={{ height:40, width:40 }} >
                <Image style= {{ height: undefined,width: undefined,flex: 1 }} source={{ uri:img_url+row.image }} />
              </View>  
            </View>
            <View style={{ width:'55%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ color:colors.grey, fontFamily:bold, fontSize:14}}>{row.product_name}</Text>
              <View style={{ margin:2 }}/>
              <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:12}}>{global.currency}{row.price}</Text>
            </View>
            <View style={{ width:'25%', alignItems:'flex-end', justifyContent:'center'}}>
              <View style={{ borderWidth:1, borderColor:colors.theme_fg, borderRadius:10, padding:4}}>
                <UIStepper
                  displayValue={true}
                  tintColor={colors.theme_fg}
                  width={80}
                  height={20}
                  imageWidth={10}
                  fontFamily={bold}
                  textColor={colors.theme_fg}
                  borderColor={colors.theme_fg_three}
                  fontSize={14}
                  initialValue={props.cart_items[props.cart_items.findIndex(x => x.product_id == row.product_id)] ? props.cart_items[props.cart_items.findIndex(x => x.product_id == row.product_id)].qty : 0 }
                  value={props.cart_items[props.cart_items.findIndex(x => x.product_id == row.product_id)] ? props.cart_items[props.cart_items.findIndex(x => x.product_id == row.product_id)].qty : 0 }
                  onValueChange={(value) => { add_to_cart(value,row.product_id,row.product_name,row.price_per_item,row.image,row.unit) }}
                />
              </View>
            </View>
          </View>
        ))}
        {/*<View style={{ flexDirection:'row' }} >
          <FlatList
            data={props.cart_items}
            renderItem={renderItem}
            keyExtractor={item => item.product_name}
          />
        </View>*/}
        {!props.promo ? 
        <View style={{ width:'100%', flexDirection:'row',borderWidth:1,borderColor:colors.light_blue, backgroundColor:colors.light_blue, borderRadius:15, padding:15}}>
          <View style={{ width:'20%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
            <View style={{ height:50, width:50 }} >
              <Image style= {{ height: undefined,width: undefined,flex: 1 }} source={ discount } />
            </View>  
          </View>
          <View style={{ width:'55%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:15}}>Apply Coupon Code</Text>
            <View style={{ margin:2 }}/>
            <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>Unlock offers with coupon codes</Text>
          </View>
          <TouchableOpacity onPress={promo_code} style={{ width:'25%', alignItems:'center', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14}}>APPLY</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={{ width:'100%', flexDirection:'row',borderWidth:1,borderColor:colors.light_blue, backgroundColor:colors.light_blue, borderRadius:15, padding:15}}>
          <View style={{ width:'20%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
            <View style={{ height:50, width:50 }} >
              <Image style= {{ height: undefined,width: undefined,flex: 1 }} source={ promo_apply } />
            </View>  
          </View>
          <View style={{ width:'55%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ color:colors.success, fontFamily:bold, fontSize:14}}>Code {props.promo.promo_code} applied!</Text>
            <View style={{ margin:2 }}/>
            <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{props.promo.description}</Text>
          </View>
          <TouchableOpacity onPress={promo_code} style={{ width:'25%', alignItems:'center', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14}}>CHANGE</Text>
          </TouchableOpacity>
        </View>
        }
        <View style={{ margin:10 }}/>
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Order Summary</Text>
        <View style={{ margin:5 }}/>
        <View style={{ padding:10 }}>
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'50%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>Sub Total</Text>
            </View>
            <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}> 
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>{global.currency}{props.sub_total}</Text>
            </View>
          </View>
          <View style={{ margin:10 }} />
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'50%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>Discount</Text>
            </View>
            <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}> 
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>-{global.currency}{props.discount}</Text>
            </View>
          </View>
          <View style={{ margin:10 }} />
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'50%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>Delivery Charge</Text>
            </View>
            <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}> 
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>{global.currency}{props.delivery_charge}</Text>
            </View>
          </View>
          <View style={{ margin:10 }} />
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'50%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>Tax</Text>
            </View>
            <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}> 
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>{global.currency}{props.tax}</Text>
            </View>
          </View>
          <View style={{ margin:10 }} />
          <View style={{ borderBottomWidth:1, borderColor:colors.light_grey, }} />
          <View style={{ margin:10 }} />
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'50%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>Grand Total</Text>
            </View>
            <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}> 
              <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>{global.currency}{props.total}</Text>
            </View>
          </View>
          <View style={{ margin:10 }} />
          <View style={{ borderBottomWidth:1, borderColor:colors.light_grey }} />
          <View style={{ margin:5 }}/>
        </View>
        {props.address &&
          <View style={{width:'100%', flexDirection:'row',borderWidth:1,borderColor:colors.light_blue, backgroundColor:colors.light_blue, borderRadius:15, padding:15}}>
            <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
              <Icon type={Icons.Ionicons} name="location" style={{ fontSize:30, color:colors.theme_fg }} />
            </View>  
            <View style={{ width:'65%', justifyContent:'flex-start', alignItems:'flex-start'}}>
              <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{props.address.address}</Text>   
            </View>
            <View style={{ width:'20%',justifyContent:'center', alignItems:'flex-end'}}>
              <TouchableOpacity onPress={change_address}>
                <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:12 }}>CHANGE</Text>
              </TouchableOpacity>
            </View>  
          </View>
        }
        {/*<View style={{ padding:10 }}>
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}>
            <TouchableOpacity onPress={showDatepicker} style={{ width:'100%', flexDirection:'row',borderWidth:1,borderColor:colors.light_blue, backgroundColor:colors.light_blue, borderRadius:10, padding:10}}>
              <View style={{ width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                <Icon type={Icons.Ionicons} name="today" style={{ fontSize:20, color:colors.theme_fg }} />
                <View style={{ margin:3 }} />
                <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14}}>Choose Expected Delivery Date</Text>
              </View>
            </TouchableOpacity>
          </CardView>
        </View>
        <View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>*/}
      </ScrollView>
      {props.address ? 
        <TouchableOpacity activeOpacity={1} onPress={place_order} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
          <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
              Place Order
          </Text>
        </TouchableOpacity>
      :
        <TouchableOpacity activeOpacity={1} onPress={change_address} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
          <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
              Select Address
          </Text>
        </TouchableOpacity>
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_fg_three,
  },
});

function mapStateToProps(state){
  return{
    pharm_id : state.order.pharm_id,
    cart_items : state.order.cart_items,
    cart_count : state.order.cart_count,
    sub_total : state.order.sub_total,
    promo : state.order.promo,
    discount : state.order.discount,
    total : state.order.total,
    tax : state.order.tax,
    delivery_charge : state.order.delivery_charge,
    address : state.current_location.address,
  };
}

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updatePharmId: (data) => dispatch(updatePharmId(data)),
  updatePromo: (data) => dispatch(updatePromo(data)),
  calculateTotal: () => dispatch(calculateTotal()),
  updateTaxList: (data) => dispatch(updateTaxList(data)),
  updateDeliveryCharge: (data) => dispatch(updateDeliveryCharge(data)),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps,mapDispatchToProps)(PharmCart);