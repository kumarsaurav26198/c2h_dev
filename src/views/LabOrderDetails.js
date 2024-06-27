import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, api_url, customer_lab_order_details, img_url, call } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import Moment from 'moment';

const LabOrderDetails = () => { 
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [order_details, setOrderDetails] = useState(''); 
  const [item_list, setItemList] = useState([]); 
  const [order_id, setOrderId] = useState(route.params.order_id); 
  const [gender, setGender] = useState(''); 

  useEffect(() => {
    get_order_details();
  },[]);

  const get_order_details = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_lab_order_details,
      data:{ order_id:order_id }
    })
    .then(async response => {
      setLoading(false);
      setOrderDetails(response.data.result);
      check_gender(response.data.result.patient_gender);
      setItemList(response.data.result.item_list); 
    })
    .catch( async error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const check_gender = (gender_id) =>{
    if(gender_id == 1 ){
      setGender('Male');
    }else if(gender_id == 2){
      setGender('Female');
    }else if(gender_id == 3){
      setGender('Others')
    }
  }

  const contact = async(number) =>{
    let phoneNumber = '';
    if (Platform.OS === 'android'){ 
      phoneNumber = await `tel:${number}`; 
    }else{
      phoneNumber = await `telprompt:${number}`; 
    }
    await Linking.openURL(phoneNumber);
  }

  return (
    <SafeAreaView style={styles.container}>
        <Loader visible={loading}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:15, }}>
          <View style={{ flexDirection:'row' }}>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={{ height: 50, width: 50 }} >
                <Image style={{ height: undefined, width: undefined, flex:1 }} source={{ uri: img_url+order_details.lab_image }}/>
              </View> 
            </View> 
            <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{order_details.lab_name}</Text>
              <View style={{ margin:2 }} />
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{order_details.lab_address}</Text>
              <View style={{ margin:2 }} />
              {order_details.booking_type == 1 ?
                <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg}}>Collect From Home</Text>
              :
              <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg}}>Direct Appointment</Text>
              }
              
            </View>
            <TouchableOpacity onPress={contact.bind(this,order_details.lab_phone_number)} style={{ width:'10%', alignItems:'flex-end', justifyContent:'center'}}>
            <View style={{ height: 30, width: 30 }} >
              <Image style={{ height: undefined, width: undefined, flex:1 }} source={call}/>
            </View> 
          </TouchableOpacity> 
          </View>
        </View>
        <View style={{ margin:2 }} />
        <View style={{ borderBottomWidth:1, borderColor:colors.light_grey}} />
        <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, }}>
          <View style={{ flexDirection:'row' }}>
            <View style={{ width:'90%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Patient Details</Text>
              <View style={{ margin:5 }} />
              <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center', padding:10,}}>
              <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>{order_details.patient_name}</Text>
              <View style={{ margin:2 }}/>
              <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{Moment(order_details.patient_dob).format('MMM DD, YYYY')} ,{gender}</Text>
              <View style={{ margin:2 }}/>
              <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{order_details.address}</Text>
            </View>
            </View>
          </View>
        </View>
        <View style={{ margin:2 }} />
        <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, }}>
          <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Package Details</Text>
          <View style={{ margin:5 }} />
        {item_list.map((row, index) => (
          <View style={{ backgroundColor:colors.theme_fg_three }}>
            <View style={{ width:'100%', flexDirection:'row', padding:10, }}>
              <View style={{ width:'20%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
                <View style={{ height:50, width:50, borderRadius:10 }} >
                  <Image style= {{ height: undefined,width: undefined,flex: 1, borderRadius:10 }} source={{ uri:img_url+row.package_image}} />
                </View>  
              </View>
              <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}}>
                <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:16}}>{row.item_name}</Text>
                <View style={{ margin:2 }}/>
                <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{row.short_description}</Text>
              </View>
              <View style={{ width:'20%', alignItems:'flex-end', justifyContent:'center'}}>
                <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:18}}>{global.currency}{row.price}</Text>
              </View>
            </View>
          </View>
        ))}
        </View>
        <View style={{ margin:2 }} />
        <View style={{ borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, }}>
          <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>Order Summary</Text>
          <View style={{ margin:5 }} />
          <View style={{ width:'100%', flexDirection:'row', paddingLeft:10,}}>
            <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Sub Total</Text>
            </View>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}> 
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>{global.currency}{order_details.sub_total}</Text>
            </View>
          </View>
          <View style={{ margin:5 }} />
          <View style={{ width:'100%', flexDirection:'row', paddingLeft:10,}}>
            <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Tax</Text>
            </View>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}> 
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>{global.currency}{order_details.tax}</Text>
            </View>
          </View>
          <View style={{ margin:5 }} />
          <View style={{ width:'100%', flexDirection:'row', paddingLeft:10,}}>
            <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Discount</Text>
            </View>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}> 
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>{global.currency}{order_details.discount}</Text>
            </View>
          </View>
        </View>
        <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.light_blue, padding:20 }}>
          <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>Grand Total</Text>
          </View>
          <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}> 
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>{global.currency}{order_details.total}</Text>
          </View>
        </View>
      </ScrollView>
      {order_details.special_instruction &&
        <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.theme_fg_three, paddingLeft:15, paddingTop: 20, paddingBottom: 20, }}>
          <View style={{ width:'40%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold }}>Special Instruction - </Text>
          </View>
          <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}}> 
            <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold }}>{order_details.special_instruction}</Text>
          </View>
        </View>
      }
    </SafeAreaView>   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'flex-start',
    backgroundColor:colors.light_grey
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'49%',
    borderWidth:1
  },
   button1: {
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    width:'100%',
    borderWidth:1
  },
});


export default LabOrderDetails;
