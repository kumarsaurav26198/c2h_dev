import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, Alert} from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, api_url, pharmacy_products, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview';
import UIStepper from 'react-native-ui-stepper';
import axios from 'axios';
import Loader  from '../components/Loader';
import { connect } from 'react-redux';
import { updatePharmId, reset, addToCart, updateSubtotal  } from '../actions/PharmOrderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PharmProducts = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [category_id, setCategoryId] = useState(route.params.category_id);
  const [sub_category_id, setSubCategoryId] = useState(route.params.sub_category_id);
  const [pharm_id, setPharmId] = useState(route.params.pharm_id);
  const [products, setProducts] = useState([]);
  const [view_value, setViewValue] = useState(true);

  const setValue = (value) => {
    // do something with value
  }

  useEffect(() => {
    get_products(); 
  },[]);

  const check_vendor = async() =>{
    if(props.pharm_id == pharm_id || props.pharm_id == undefined){
      setViewValue(true);
      return true;
    }else{
      setViewValue(false);
      Alert.alert(
        "Reset !",
        "You are select products from another pharmacies. Can we remove existing items from cart?",
        [
          {
            text: "Cancel",
            onPress: () => { return false; },
            style: "cancel"
          },
          { text: "OK", onPress: async() => { 
            await props.reset();
            props.updatePharmId(pharm_id);
            this.setState({ view_value : false });
            alert('Now you can add products');
            return true;
          } }
        ],
        { cancelable: false }
      );
      
    }
  }

  const add_to_cart = async (qty,item_id,item_name,price,item_image,unit) => {
    if(check_vendor()){
      let cart_items = await props.cart_items;
      let old_item_details = await cart_items[props.cart_items.findIndex(x => x.product_id == item_id)];
      let sub_total = await parseFloat(props.sub_total);
      let total_price = await parseFloat(qty * price);
      if(old_item_details != undefined && total_price > 0){
        let final_price = await parseFloat(total_price) - parseFloat(old_item_details.price);
        sub_total = await parseFloat(sub_total) + parseFloat(final_price);
      }else if(total_price > 0){
        let final_price = await parseFloat(qty * price);
        sub_total = await parseFloat(sub_total) + parseFloat(final_price);
      }
      if(qty > 0){
        let item = await {
          product_id: item_id,
          product_name: item_name,
          unit:unit,
          qty: qty,
          price_per_item: parseFloat(price),
          price:parseFloat(qty * price),
          image:item_image
        }
        if(old_item_details != undefined){
          cart_items[props.cart_items.findIndex(x => x.product_id == item_id)] = await item;
        }else{
          await cart_items.push(item);
        }
        
        const st_items = cart_items.filter(el => Object.keys(el).length);
        await store_data(st_items,sub_total.toFixed(2),pharm_id)
        await props.addToCart(st_items);
        await props.updateSubtotal(sub_total.toFixed(2));
        await props.updatePharmId(pharm_id);
       }else{
          delete cart_items[props.cart_items.findIndex(x => x.product_id == item_id)];
          const st_items = cart_items.filter(el => Object.keys(el).length);
          sub_total = parseFloat(sub_total) - parseFloat(price);
          await store_data(st_items,sub_total.toFixed(2),pharm_id)
          await props.addToCart(st_items);
          await props.updateSubtotal(sub_total);
       }   
    }
    
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

  const get_products = async() =>{ 
    await axios({
      method: 'post', 
      url: api_url + pharmacy_products,
      data:{ vendor_id : pharm_id, sub_category_id:sub_category_id }
    })
    .then(async response => {
      console.log(response.data.result)
      setProducts(response.data.result);
    })
    .catch(error => {
      alert('Sorry something went wrong');
    });
  }

  const view_cart = () =>{
    if(global.id == 0){
      navigation.navigate("CheckPhone")
    }else{
      navigation.navigate("PharmCart");
    }
  }

  const renderItem = ({ item }) => (
    <CardView
      style={{ margin:8, padding:10, width:'46%' }}
      cardElevation={5}
      cardMaxElevation={5}
      cornerRadius={10}>
      <View style={{ alignItems:'center', justifyContent:'center' }}>
        <Image source={{ uri:img_url+item.image}} style={{ height:75, width:75 }} />
        <View style={{ margin:5 }} />
        <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular}}>{item.product_name} ({item.unit})</Text>
        <View style={{ margin:5 }} />
        <View style={{ alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
          {item.marked_price > 0 &&
            <Text style={{ textDecorationLine: 'line-through', fontSize:12, color:colors.theme_fg_two, fontFamily:regular, marginRight:10}}>{global.currency}{item.marked_price}</Text>
          }
          <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>{global.currency}{item.price}</Text>
        </View>
        <View style={{ margin:5 }} />
        <View style={{ borderWidth:1, borderColor:colors.theme_fg, borderRadius:10, padding:4}}>
          <UIStepper
            displayValue={view_value}
            tintColor={colors.theme_fg}
            width={80}
            height={20}
            imageWidth={10}
            fontFamily={bold}
            textColor={colors.theme_fg}
            borderColor={colors.theme_fg_three}
            fontSize={14}
            initialValue={props.cart_items[props.cart_items.findIndex(x => x.product_id == item.id)] ? props.cart_items[props.cart_items.findIndex(x => x.product_id == item.id)].qty : 0 }
            value={props.cart_items[props.cart_items.findIndex(x => x.product_id == item.id)] ? props.cart_items[props.cart_items.findIndex(x => x.product_id == item.id)].qty : 0 }
            onValueChange={(value) => { add_to_cart(value,item.id,item.product_name,item.price,item.image,item.unit) }}
          />
        </View>
        <View style={{ margin:5 }} />
        <Text numberOfLines={2} style={{ fontSize:11, color:colors.grey, fontFamily:regular}}>{item.description}</Text>
      </View>
    </CardView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      {products.length > 0 ? 
      <FlatList
        data={products}
        style={{margin:7}}
        numColumns={2}                  
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> 
      :
        <View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
          <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no data found</Text>
        </View>
      }
      {props.cart_count > 0 &&
        <TouchableOpacity activeOpacity={1} onPress={view_cart} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
          <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
              View Cart ({props.cart_count})
          </Text>
        </TouchableOpacity>
      }
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  row: {
    flex: 1,
    justifyContent: "space-around"
  }
});

function mapStateToProps(state){
  return{
    pharm_id : state.order.pharm_id,
    cart_items : state.order.cart_items,
    cart_count : state.order.cart_count,
    sub_total : state.order.sub_total,
    delivery_charge : state.order.delivery_charge,
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updatePharmId: (data) => dispatch(updatePharmId(data)),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps,mapDispatchToProps)(PharmProducts);

