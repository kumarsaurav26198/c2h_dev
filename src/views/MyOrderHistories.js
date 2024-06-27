import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, pharmacy_order_list, api_url, img_url } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader  from '../components/Loader';
import Moment from 'moment';
import { connect } from 'react-redux';
import { updatePharmId, addToCart, updateSubtotal, reset  } from '../actions/PharmOrderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
const MyOrdersHistories = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [order_list, setOrderList] = useState([]);

  const myorder_details = () => {
    navigation.navigate("MyOrderDetails")
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      grt_order_list(); 
    }); 
    return unsubscribe;
  },[]);

  const re_order = async(cart_items,sub_total,pharm_id) =>{
    Alert.alert(
      "Confirm !",
      "Are you sure, You want to re-order this products?",
      [
        {
          text: "Cancel",
          onPress: () => { return false; },
          style: "cancel"
        },
        { text: "OK", onPress: async() => { 
          await props.reset();
          add_to_cart(cart_items,sub_total,pharm_id);
          return true;
        } }
      ],
      { cancelable: false }
    );
  }

  const add_to_cart = async(cart_items,sub_total,pharm_id) => {
    await props.reset();
    await store_data(cart_items,sub_total.toFixed(2),pharm_id);
    await props.addToCart(cart_items);
    await props.updateSubtotal(sub_total.toFixed(2));
    await props.updatePharmId(pharm_id);
    await view_cart();
  }

  const view_cart = () =>{
    navigation.navigate("PharmCart");
  }

  const store_data = async(cart_items,sub_total,pharm_id) =>{
    try{
        await AsyncStorage.setItem('cart_items', JSON.stringify(cart_items));
        await AsyncStorage.setItem('sub_total', sub_total.toString());
        await AsyncStorage.setItem('pharm_id', pharm_id.toString());
    }catch (e) {
        alert(e);
    }
  }

  const grt_order_list = async() =>{ 
    await axios({
      method: 'post', 
      url: api_url + pharmacy_order_list,
      data:{ customer_id:global.id }
    })
    .then(async response => {
      console.log(response.data.result)
      setOrderList(response.data.result)
    })
    .catch(error => {
      alert('Sorry something went wrong');
    });
  }

  const show_products = (items) => {
      if(items){
        const list = JSON.parse(items);
        return list.map((data) => {
          return (
              <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center', padding:5 }} >
                <View style={{ width:'10%', alignItems:'flex-start', justifyContent:'center' }}>
                  <View style={{ height:25, width:25, borderWidth:1, borderColor:colors.theme_fg_three, borderRadius:5 }} >
                    <Image style= {{ height: undefined,width: undefined,flex: 1, borderRadius:5 }} source={{ uri : img_url + data.image }} />
                  </View>  
                </View>
                <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center' }}>
                  <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular, letterSpacing:1}}>{data.product_name}</Text>
                </View>
                <View style={{ width:'20%', alignItems:'flex-end', justifyContent:'center' }}>
                  <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular, letterSpacing:1}}>x{data.qty}</Text>
                </View>
              </View>
          )
        })
      }else{
        return(
          <Text style={{ fontFamily:bold, fontSize:12, color:colors.grey}}>Please wait vendor will add your prescription products shortly</Text>
        )
      }
  }

  const move_rating = (data) =>{
		navigation.navigate("OrderRating",{ data : data });
	}

  const move_chat =(id) =>{
    navigation.navigate("Chat",{id:id})
  }

  const renderItem = ({ item }) => (
    <View style={{ marginBottom:20, margin:5 }} >
      <TouchableOpacity activeOpacity={1}>
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={10}>
          <View style={{ alignItems:'center', width:'100%'}}>
            <View style={{ width:'100%', alignItems:'center', backgroundColor:colors.theme_fg , borderColor:colors.theme_fg, borderWidth:1, padding:10 , flexDirection:'row'}} >
              <View style={{ alignItems:'flex-start', justifyContent:'center', width:'70%'}}>
                <Text style={{ fontSize:14, color:colors.theme_fg_three, fontFamily:bold  }}>{ item.status }</Text>
              </View>
            </View>
          </View>
          <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.theme_fg_three , padding:15, borderRadius:10 }} >
            <View style={{ width:'25%', alignItems:'flex-start', justifyContent:'center' }} >
              <View style={styles.pre_style8} >
                <Image
                  style= {styles.pre_style9}
                  source={{ uri : img_url + item.store_image }}
                />
              </View>
            </View>
            <View style={{ width:'55%', alignItems:'flex-start', justifyContent:'center' }} >
              <View style={{ flexDirection:'row' }} >
                <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold, textAlign:'center', letterSpacing:1}}>{item.store_name}</Text>
              </View>
              <View style={{ margin:3 }} />
              <View style={{ alignItems:'center', width:'100%', flexDirection:'row'}}>
                <Icon type={Icons.AntDesign} name="clockcircle" style={{ fontSize:15, color:colors.grey }} />
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular  }}>{Moment(item.created_at).format('DD MMM-YY')}</Text>
              </View>
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular, letterSpacing:1 }}>#{item.id}</Text>
            </View>
            {item.status_id >= 2 && item.slug != 'delivered' &&
              <TouchableOpacity onPress={move_chat.bind(this,item.id)} style={{ width:'20%', flexDirection: 'row',  alignItems:'flex-end', justifyContent:'center', backgroundColor:colors.theme_bg, borderRadius:10, height:25, paddingBottom:4}}>
                <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_bg_three, alignItems:'flex-end'}}>Chat</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={{ margin:5}}/>
          <View style={{ width:'100%', borderTopWidth:1, borderColor:colors.theme_fg, padding:15, borderStyle:'dashed' }} >
            <View style={{ flexDirection:'row' }} >
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:bold }}>Ordered Items</Text>
              <View style={{ margin:3 }} />
              <Icon type={Icons.FontAwesome5} name="shopping-bag" style={{ fontSize:15, color:colors.grey }} />
            </View>
            <View style={{ margin:5 }} />
            {show_products(item.items)}
            <View style={{ margin:5 }} />
          </View>
          <View style={{ width:'100%', flexDirection:'row', borderTopWidth:1, borderColor:colors.theme_fg, padding:15, borderStyle:'dashed' }} >
            <View style={{ width:'30%',  alignItems:'flex-start', justifyContent:'center',   }} >
              <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular, letterSpacing:1 }}>Total</Text>
            </View>
            {item.status == 6 ?
            <TouchableOpacity onPress={re_order.bind(this,JSON.parse(item.items), item.sub_total, item.vendor_id)} style={{ width:'30%',  alignItems:'center', justifyContent:'center', backgroundColor:colors.theme_bg, borderRadius:5, padding:5  }} >
              <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold, letterSpacing:1 }}>Re-order</Text>
            </TouchableOpacity>
            :
            <View style={{ width:'30%' }} />
            }
            <View style={{ width:'40%',  alignItems:'flex-end', justifyContent:'center',   }} >
              <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>{global.currency}{item.total}</Text>
            </View>
          </View>
          {item.rating == 0 && item.status == 6 &&
            <TouchableOpacity onPress={move_rating.bind(this,item)} style={{ marginBottom:10, borderWidth:1, borderRadius:10, backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', marginRight:'5%'}}>
              <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold  }}>Add Rating</Text>
            </TouchableOpacity>
          }
        </CardView>
      </TouchableOpacity>
    </View>
  );
  
  return (
  <SafeAreaView style={styles.container}>
    <Loader visible={loading} /> 
    <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}> 
      <FlatList
        data={order_list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={{ margin:50 }} />
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:colors.light_blue,
  },
  pre_style8: { 
    height:70,
    width:70
  },
  pre_style9: {
    flex:1,
    width:undefined,
    height:undefined,
    borderRadius:10
  },
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updatePharmId: (data) => dispatch(updatePharmId(data)),
  reset: () => dispatch(reset()),
});

export default connect(null,mapDispatchToProps)(MyOrdersHistories);
