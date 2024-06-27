import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, api_url, customer_lab_pending_orders, img_url, empty_list } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import CardView from 'react-native-cardview';
import axios from 'axios';
import Loader  from '../components/Loader';

const LabOrders = () => { 
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pending_list, setPendingList] = useState([]); 

  const order_details = (order_id) =>{
    navigation.navigate("LabOrderDetails",{order_id:order_id})
  }

  useEffect(() => {
    get_pending_list();
  },[]);

  const get_pending_list = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_lab_pending_orders,
      data:{ customer_id:global.id }
    })
    .then(async response => {
      setLoading(false);
      setPendingList(response.data.result);
    })
    .catch( async error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.box} onPress={order_details.bind(this,item.id)} activeOpacity={1}>
      <CardView
        cardElevation={5}
        cardMaxElevation={10}
        cornerRadius={10}>
        <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:10, borderRadius:10}}>
          <View style={{ flexDirection:'row' }}>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={{ height: 50, width: 50 }} >
                <Image style={{ height: undefined, width: undefined, flex:1 }} source={{uri: img_url+item.lab_image }}/>
              </View> 
            </View> 
            <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{ item.lab_name }</Text>
              <View style={{ margin:1 }} />
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{ item.address }</Text>
              <View style={{ margin:3 }} />
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>#Order ID -{ item.id }</Text>
            </View>
          </View>
          <View style={{ margin:5 }} />
          <View style={{ borderBottomWidth:1, borderColor:colors.light_grey}} /> 
          <View style={{ margin:5 }} />
          <View style={{ flexDirection:'row' }}>
            <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>Patient Name :</Text>
            <View style={{ margin:2 }} /> 
            <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{ item.patient_name }</Text>
          </View>
          <View style={{ margin:5 }} />
          <View style={{ flexDirection:'row', width:'100%'}}>
            <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>Collective Person :</Text>
            <View style={{ margin:2 }} /> 
            {item.collective_person == 0 ?
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>Person will be assigned soon.</Text>
              :
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{ item.collective_person_name }</Text>
            }
          </View>
        </View>
        <View style={{ width:'90%', flexDirection:'row', padding:5, marginLeft:'5%'}}>
          <View style={ styles.button }>
            <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold}}>{item.status_for_customer}</Text>
          </View>
          <View style={{ margin:'1%' }}/>
        </View>
        <View style={{ margin:5 }} /> 
      </CardView>
      <View style={{ margin:10 }} />
    </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container}>
    <Loader visible={loading}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ margin:10 }} />
        {pending_list.length == 0 ?
          <View style={{ alignSelf:'center', justifyContent:'center', backgroundColor:colors.theme_bg_three}}>
            <View style={{ height: 300, width: 350 }} >
              <Image style={{ height: undefined, width: undefined, flex:1 }} source={empty_list}/>
            </View>
            <Text style={{ fontFamily:bold, fontSize:14, textAlign:'center', marginTop:'20%'}}>Orders Not receiver yet...</Text>
            </View>
          :
          <FlatList
            data={pending_list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
        <View style={{ margin:5 }} />
      </ScrollView>
    </SafeAreaView>   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'flex-start',
    backgroundColor:colors.theme_fg_three
  },
  image_style:{
    width:70,
    height:70,
    borderRadius:10,
    borderWidth:1,
    borderColor:colors.theme_fg
  },
  box: {
    marginLeft:10,
    marginRight:10,
  },
   pickup_location:{ 
    fontSize:12, 
    color:colors.grey, 
    fontFamily:bold,
    marginLeft:5 
  },
  drop_location:{ 
    fontSize:12, 
    color:colors.grey, 
    fontFamily:bold,
    marginLeft:5  
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
   button1: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    width:'49%',
    borderWidth:1
  },
});


export default LabOrders;
