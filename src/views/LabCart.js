import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, View, TextInput, TouchableOpacity, Image} from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, light, offer_img, location, user_details_img, customer_lab_place_order } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { updateLabAddToCart, updateLabSubTotal, updateLabCalculateTotal, updateLabTotal, updateLabDiscount, updateLabTax } from '../actions/LabOrderActions';

const LabCart = (props) => {
  const navigation = useNavigation();
  const [special_instruction, setSpecialInstruction] = useState('');
  const [booking_type, setBookingType] = useState(1);

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      props.updateLabCalculateTotal();
    });
    return unsubscribe;
  },[]);

  const patient_details = () => {
    navigation.navigate("PatientDetails")
  }

  const promo_code = () =>{
    navigation.navigate("PromoCode",{ from : 'lab'});
  }

  const add_test = () =>{
    navigation.navigate("Home");
  }

  const change_address = () =>{
    navigation.navigate("AddressList",{from:"lab_cart"})
  }

  const change_booking_type = (type) =>{
    setBookingType(type);
  }

  const navigate = () =>{
    if(props.patient_gender_id == undefined || props.patient_name == undefined || props.patient_dob == undefined){
      patient_details();
    }else if(props.address == undefined){
      alert('Please select your address.')
    }else if(global.id == 0){
      navigation.navigate("CheckPhone");
    }else{
        let data = {
            customer_id:global.id,
            patient_name:props.patient_name,
            patient_dob:props.patient_dob,
            patient_gender:props.patient_gender_id,
            lab_id:props.lab_id,
            address_id:props.address.id,
            promo_id:props.promo ? props.promo.id : 0,
            discount:props.discount,
            booking_type:booking_type,
            tax:props.tax,
            sub_total:props.sub_total, 
            total:props.total,
            special_instruction:special_instruction,
            items:JSON.stringify(Object.values(props.cart_items)),
            payment_mode:props.payment_mode,
        }
      navigation.navigate("PaymentMethods",{ data:data, from:"lab_cart", type : 2, route:customer_lab_place_order, amount : props.total, })
    }
  }

  const renderItem = ({ item }) => (

     <View style={{ padding:10, borderBottomWidth:1, borderColor:colors.light_grey, backgroundColor:colors.theme_bg_three }}>
        <View style={{ width:'100%', flexDirection:'row'}}>
          <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center' }}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold}}>{ item.test}</Text>
          </View>
          <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center' }}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular}}>{global.currency}{ item.price}</Text>
          </View>
          <TouchableOpacity style={{ width:'10%', alignItems:'flex-end', justifyContent:'center' }}>
            <Icon type={Icons.Ionicons} name={item.icon} color={colors.theme_fg_two} style={{ fontSize:25 }} />
          </TouchableOpacity>
        </View>
        <View style={{ margin:5 }}/>
        <View style={{ width:'100%', flexDirection:'row'}}>
          <View style={{ width:'5%', alignItems:'flex-start', justifyContent:'center'}}>
            <Icon type={Icons.Feather} name="file-text" color={colors.theme_fg_two} style={{ fontSize:15, }} />
          </View>
          <View style={{ width:'95%', alignItems:'flex-start', justifyContent:'center'}}>
            <TouchableOpacity style={{ borderBottomWidth:0.3, borderColor:colors.theme_fg_two, width:'40%'  }} >
              <Text style={{ color:colors.grey, fontFamily:light, fontSize:12,}}>Read Test Preparation</Text>
            </TouchableOpacity>
          </View> 
        </View>  
        <View style={{ margin:10 }}/>
        <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:light}}>E-Reports on same day</Text> 
        <View style={{ margin:5 }}/>
      </View> 
  );

return (
  <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      
      <View style={{ padding:10, backgroundColor:colors.light_blue }}>
        <Text style={{ fontSize:16, color:colors.grey, fontFamily:bold}}>Selected test ({props.cart_count})</Text>
      </View> 
      {props.cart_items.map((row, index) => (
        <View style={{ padding:10, borderBottomWidth:1, borderColor:colors.light_grey, backgroundColor:colors.theme_bg_three }}>
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center' }}>
              <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold}}>{ row.item_name}</Text>
            </View>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center' }}>
              <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular}}>{global.currency}{row.price}</Text>
            </View>
            <TouchableOpacity style={{ width:'10%', alignItems:'flex-end', justifyContent:'center' }}>
              <Icon type={Icons.Ionicons} name="close" color={colors.theme_fg_two} style={{ fontSize:25 }} />
            </TouchableOpacity>
          </View>
          <View style={{ margin:5 }}/>
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'5%', alignItems:'flex-start', justifyContent:'center'}}>
              <Icon type={Icons.Feather} name="file-text" color={colors.theme_fg_two} style={{ fontSize:15, }} />
            </View>
            <View style={{ width:'95%', alignItems:'flex-start', justifyContent:'center'}}>
              <TouchableOpacity style={{ borderBottomWidth:0.3, borderColor:colors.theme_fg_two, width:'40%'  }} >
                <Text style={{ color:colors.grey, fontFamily:light, fontSize:12,}}>Read Test Preparation</Text>
              </TouchableOpacity>
            </View> 
          </View>  
          <View style={{ margin:10 }}/>
          <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:light}}>E-Reports on same day</Text> 
          <View style={{ margin:5 }}/>
        </View> 
      ))}
      <View>
      <View style={styles.border_style}/> 
        <View style={{ margin:5 }}/>
        <TouchableOpacity onPress={add_test} style={{ padding:10, flexDirection:'row', color:colors.theme_fg_three }}>
          <Icon type={Icons.Feather} name="plus-circle" color={colors.theme_fg} style={{ fontSize:17 }} />
          <View style={{ margin:2, }}/>
          <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>ADD MORE TESTS</Text>
        </TouchableOpacity>
        <View style={{ margin:5 }}/>
      </View>
        <View style={styles.border_style1}/> 
        <View style={{ margin:5 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold, padding:10}}>Offers</Text>
        {!props.promo ? 
          <View style={{flexDirection:'row', padding:10 , width:'100%'}}>
            <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
               <Image style={{ height: 20, width: 20  }} source={offer_img} />   
            </View>  
            <View style={{ width:'70%', justifyContent:'center', alignItems:'flex-start'}}>
              <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>Select a coupon code</Text>   
            </View>
            <View style={{ width:'20%',justifyContent:'flex-start', alignItems:'flex-end'}}>
              <TouchableOpacity onPress={promo_code}>
                <Text style={{ color:colors.red, fontFamily:regular, fontSize:12 }}>View Offers</Text>
              </TouchableOpacity>
            </View> 
          </View> 
          :
          <View style={{flexDirection:'row', padding:10 }}>
            <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
               <Image style={{ height: 20, width: 20  }} source={offer_img} />   
            </View>  
            <View style={{ width:'65%', justifyContent:'center', alignItems:'flex-start'}}>
              <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>Code {props.promo.promo_code} applied!</Text>
              <Text style={{ fontFamily:regular, fontSize:13, color:colors.grey}}>{props.promo.description}</Text>   
            </View>
            <View style={{ width:'25%',justifyContent:'flex-start', alignItems:'flex-end'}}>
              <TouchableOpacity onPress={promo_code} style={{ alignItems:'center'}}>
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14 }}>- {global.currency}{props.discount}</Text>
                <Text style={{ color:colors.red, fontFamily:regular, fontSize:12 }}>Change Offer</Text>
              </TouchableOpacity>
            </View> 
          </View>
        }
        <View style={styles.border_style1}/> 
        <View style={{ margin:5 }} /> 
        <View>
          <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold, padding:10}}>Booking Type</Text>
          <View style={{ flexDirection:'row', padding:10}}>
            <TouchableOpacity onPress={change_booking_type.bind(this,1)} activeOpacity={1} style={[booking_type == 1 ? styles.booking_type_active_bg : styles.booking_type_inactive_bg]}>
              <Text style={[booking_type == 1 ? styles.booking_type_active_fg : styles.booking_type_inactive_fg]}>Collect From Home</Text>
            </TouchableOpacity>
            <View style={{ width:'4%' }} />
            <TouchableOpacity onPress={change_booking_type.bind(this,2)} activeOpacity={1} style={[booking_type == 2 ? styles.booking_type_active_bg : styles.booking_type_inactive_bg]}>
              <Text style={[booking_type == 2 ? styles.booking_type_active_fg : styles.booking_type_inactive_fg]}>Direct Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.border_style1}/> 
        <View style={{ margin:5 }} /> 
        {props.address ?
          <View style={{flexDirection:'row', width:'100%', padding:10 ,  }}>
            <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
              <Image style={{ height: 25, width: 25 }} source={location} />
            </View>  
            <View style={{ width:'70%', justifyContent:'flex-start', alignItems:'flex-start'}}>
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{props.address.address}</Text>   
            </View>
            <View style={{ width:'20%',justifyContent:'flex-start', alignItems:'flex-end'}}>
              <TouchableOpacity onPress={change_address}>
                <Text style={{ color:colors.red, fontFamily:regular, fontSize:12 }}>CHANGE</Text>
              </TouchableOpacity>
            </View>  
          </View>
          :
          <View style={{flexDirection:'row', width:'100%', padding:10 ,  }}>
            <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
              <Image style={{ height: 25, width: 25 }} source={location} />
            </View>  
            <View style={{ width:'70%', justifyContent:'flex-start', alignItems:'flex-start'}}>
              <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>Add Address</Text>   
            </View>
            <View style={{ width:'20%',justifyContent:'flex-start', alignItems:'flex-end'}}>
              <TouchableOpacity onPress={change_address}>
                <Text style={{ color:colors.red, fontFamily:regular, fontSize:12 }}>SELECT</Text>
              </TouchableOpacity>
            </View>  
          </View>
        }
        <View style={styles.border_style1}/> 
        <View style={{ margin:5 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold, padding:10}}>Patient Details</Text>
        {props.patient_name == undefined || props.patient_dob == undefined ?      
          <View>
             <View style={{flexDirection:'row', padding:10 , width:'100%'}}>
              <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
                 <Image style={{ height: 20, width: 20  }} source={user_details_img} />   
              </View>  
              <View style={{ width:'70%', justifyContent:'center', alignItems:'flex-start'}}>
                <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>+ Patient Details</Text>   
              </View>
              <View style={{ width:'20%',justifyContent:'flex-start', alignItems:'flex-end'}}>
                <TouchableOpacity onPress={patient_details}>
                  <Text style={{ color:colors.red, fontFamily:regular, fontSize:12 }}>Add Details</Text>
                </TouchableOpacity>
              </View> 
            </View> 
            <View>
              <TextInput
              style={styles.textField}
              onChangeText={text => setSpecialInstruction(text)}
              multiline={true}
              placeholder="List your special instructions."
              placeholderTextColor={colors.regular_grey}
              underlineColorAndroid='transparent'
            />
            </View>
          </View>
          :
          <View>
            <View style={{flexDirection:'row', padding:10 , width:'100%'}}>
              <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
                 <Image style={{ height: 20, width: 20  }} source={user_details_img} />   
              </View>  
              <View style={{ width:'70%', justifyContent:'center', alignItems:'flex-start'}}>
                <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>{props.patient_name}</Text>  
                <Text style={{ fontFamily:regular, fontSize:12, color:colors.regular_grey}}>{props.patient_dob}, {props.patient_gender_name}</Text>   
              </View>
              <View style={{ width:'20%',justifyContent:'flex-start', alignItems:'flex-end'}}>
                <TouchableOpacity onPress={patient_details}>
                  <Text style={{ color:colors.red, fontFamily:regular, fontSize:12 }}>Edit Details</Text>
                </TouchableOpacity>
              </View> 
            </View> 
            <View>
              <TextInput
              style={styles.textField}
              onChangeText={text => setSpecialInstruction(text)}
              multiline={true}
              placeholder="List your special instructions."
              placeholderTextColor={colors.regular_grey}
              underlineColorAndroid='transparent'
            />
            </View>
          </View>
        }
        
        <View style={{ margin:5 }} /> 
        <View style={styles.border_style1}/>
        <View style={{ margin:5 }} />
      <View style={{ padding:10}}>
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold}}>Bill Details</Text>
      </View>
        <View style= {{padding:10}} >
          <View style={{ flexDirection:'row', justifyContent:'center',}}>
            <View style={{ width:'50%',alignItems:'flex-start'}}>
              <Text style={{ fontSize:14, color:colors.regular_grey, fontFamily:regular,}}>Item Total</Text>
            </View>
            <View style={{ width:'50%',alignItems:'flex-end'}}>
              <Text style={{ fontSize:14, color:colors.regular_grey, fontFamily:regular}}>{global.currency}{props.sub_total}</Text>
            </View>
          </View>
          {props.promo != undefined &&
            <View style={{ flexDirection:'row', justifyContent:'center',marginTop:5}}>
              <View style={{ width:'50%',alignItems:'flex-start'}}>
                <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>Promo - ({props.promo.promo_code})</Text>
              </View>
              <View style={{ width:'50%',alignItems:'flex-end', color:colors.theme_fg_two}}>
                <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>- {global.currency}{props.discount}</Text>
              </View>
            </View>
          }
          <View style={{ margin:5 }} />
          <View style={{ flexDirection:'row', justifyContent:'center',}}>
            <View style={{ width:'50%',alignItems:'flex-start'}}>
              <Text style={{ fontSize:14, color:colors.regular_grey, fontFamily:regular,}}>Taxes</Text>
            </View>
            <View style={{ width:'50%',alignItems:'flex-end'}}>
              <Text style={{ fontSize:14, color:colors.regular_grey, fontFamily:regular}}>{global.currency}{props.tax}</Text>
            </View>
          </View>
          <View style={{ margin:10 }} />
          <View style={{ flexDirection:'row', justifyContent:'center',}}>
            <View style={{ width:'50%',alignItems:'flex-start'}}>
              <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold,}}>Grand Total</Text>
            </View>
            <View style={{ width:'50%',alignItems:'flex-end'}}>
              <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold}}>{global.currency}{props.total}</Text>
            </View>
          </View>   
        </View>
      <View style={{ margin:5 }}/>
      <View style={ styles.border_style1}/>
      <View style={{ margin:30 }}/>
    </ScrollView>
    <View style={{ position:'absolute', bottom:0, height:60, padding:10, backgroundColor:colors.theme_fg_three, width:'100%'}}>
        <View style={{ width:'100%', flexDirection:'row'}}>
          <TouchableOpacity onPress={navigate} style={ styles.button }>
            <Text style={{ fontSize:14, color:colors.theme_fg_three, fontFamily:bold}}>Continue</Text>
          </TouchableOpacity>
          <View style={{ margin:'1%' }}/>
        </View>
      </View>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:colors.theme_fg_three
  },
  border_style1: {
    borderBottomWidth:10,
    borderColor:colors.light_blue,
  },
  button1: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width:'49%',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    borderWidth:1
  },
  border_style: {
    borderBottomWidth:1,
    borderColor:colors.light_blue,
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    height: 45,
    backgroundColor:colors.light_blue,
    fontFamily:regular,
    fontSize:14,
    color:colors.theme_fg_two,
    marginLeft:10,
    marginRight:10
  },
  booking_type_active_bg: {
    width:'48%', 
    borderRadius:5, 
    borderColor:colors.theme_fg, 
    backgroundColor:colors.theme_bg, 
    borderWidth:1, 
    alignItems:'center', 
    justifyContent:'center'
  },
  booking_type_active_fg: {
    fontSize:14, 
    color:colors.theme_fg_three, 
    fontFamily:bold, 
    padding:10
  },
  booking_type_inactive_bg: {
    width:'48%', 
    borderRadius:5, 
    borderColor:colors.grey, 
    backgroundColor:colors.theme_fg_three, 
    borderWidth:1, 
    alignItems:'center', 
    justifyContent:'center'
  },
  booking_type_inactive_fg: {
    fontSize:14, 
    color:colors.theme_fg_two, 
    fontFamily:regular, 
    padding:10
  },
});

function mapStateToProps(state){
  return{
    promo : state.lab_order.promo,
    sub_total : state.lab_order.sub_total,
    cart_items : state.lab_order.cart_items,
    cart_count : state.lab_order.cart_count,
    total : state.lab_order.total,
    discount : state.lab_order.discount,
    tax : state.lab_order.tax,
    patient_name : state.lab_order.patient_name,
    patient_dob : state.lab_order.patient_dob,
    patient_gender_id : state.lab_order.patient_gender_id,
    patient_gender_name : state.lab_order.patient_gender_name,
    address : state.lab_order.address, 
    lab_id : state.lab_order.lab_id, 
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateLabAddToCart: (data) => dispatch(updateLabAddToCart(data)),
  updateLabSubTotal: (data) => dispatch(updateLabSubTotal(data)),
  updateLabCalculateTotal: (data) => dispatch(updateLabCalculateTotal(data)),
  updateLabTotal: (data) => dispatch(updateLabTotal(data)),
  updateLabDiscount: (data) => dispatch(updateLabDiscount(data)),
  updateLabTax: (data) => dispatch(updateLabTax(data)), 
});

export default connect(mapStateToProps,mapDispatchToProps)(LabCart);
