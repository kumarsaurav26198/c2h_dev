import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, correct, certified, api_url, customer_lab_package_details, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateLabPromo, updateLabAddToCart, updateLabSubTotal, updateLabCalculateTotal, updateLabTotal, updateLabId, updateCurrentLabId, labReset } from '../actions/LabOrderActions';
import Loader  from '../components/Loader';

const PackageDetail = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [package_id, setPackageId] = useState(route.params.package_id);
  const [lab_id, setLabId] = useState(route.params.lab_id);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [package_details, setPackageDetails] = useState('');
  const [lab_process_steps, setLabProcessStep] = useState([]);

  const cart = () => {
    navigation.navigate("LabCart")
  }

  useEffect(() => {
    get_lab_package_details();
  },[]);

  const get_lab_package_details = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_lab_package_details,
      data:{ package_id:package_id }
    })
    .then(async response => {
      setLoading(false);
      setPackageDetails(response.data.result);
      setLabProcessStep(response.data.result.lab_process_steps);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const call_admin = async(number) =>{
    let phoneNumber = '';
    if (Platform.OS === 'android'){ 
      phoneNumber = await `tel:${number}`; 
    }else{
      phoneNumber = await `telprompt:${number}`; 
    }
    await Linking.openURL(phoneNumber);
  }

  const add_to_cart = async (item_id,item_name,price) => {
    if(props.lab_id == lab_id || props.lab_id == undefined ){
      let cart_items = await props.cart_items;
      let old_item_details = await cart_items[item_id];
      let sub_total = await parseFloat(props.sub_total);
      if(old_item_details == undefined){
          let item = {
            item_id: item_id,
            item_name: item_name,
            price: parseFloat(price)
          }
          sub_total = parseFloat(sub_total) + parseFloat(price);
          cart_items[item_id] = item;
          await props.updateLabAddToCart(cart_items);
          await props.updateLabSubTotal(sub_total.toFixed(2));
          await props.updateLabCalculateTotal();
          await props.updateLabId(lab_id);
        }else{
          delete cart_items[item_id];
          sub_total = parseFloat(sub_total) - parseFloat(price);
          await props.updateLabAddToCart(cart_items);
          await props.updateLabSubTotal(sub_total);
          await props.updateLabCalculateTotal();
        } 
    }else{
      Alert.alert(
        "Reset !",
        "You have selected other lab center test package, can we replace the existing selected test package?",
        [
          {
            text: "Cancel",
            onPress: () => { return false;},
            style: "cancel"
          },
          { text: "OK", onPress: async() => { 
            await props.labReset();
            await props.updateLabId(lab_id);
            alert('Now you can add test packages');
            return true;
          } }
        ],
        { cancelable: false }
      );
    } 
  }

return (
  <SafeAreaView style={styles.container}>
    <Loader visible={loading}/>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ padding:15}}>
        <View style={{ flexDirection:'row' }}>
          <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{package_details.short_description}</Text>
        </View>
      </View>

      <View style={{ padding:10, width:'100%', flexDirection:'row', backgroundColor:colors.theme_bg_three }}>
        <View style={{ width:'80%'}}>
          <View style={{ width:'100%', flexDirection:'row',paddingTop:15}}>
            <View style={{ width:'15%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={styles.image_style} >
                <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={certified} />
              </View>
            </View>
            <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:13, color:colors.theme_fg_two, fontFamily:bold}}>Certified Labs</Text>
            </View>
          </View>
          <View style={{ margin:3 }}/>
          <View style={{ width:'100%', flexDirection:'row', paddingBottom:15}}>
            <View style={{ width:'15%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={styles.image_style} >
                <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={correct} />
              </View>
            </View>
            <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular}}>Free Home Sample Pickup</Text>
            </View>
          </View>
        </View>
        <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
          <Text style={{ fontSize:18, color:colors.theme_fg_two, fontFamily:bold}}>{global.currency}{package_details.price}</Text>
        </View>
      </View>

      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ width:'100%', flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-end'}}>
        {props.cart_items[package_id] == undefined ?
          <TouchableOpacity onPress={add_to_cart.bind(this,package_details.id,package_details.package_name,package_details.price,package_details.lab_id)} style={ styles.button1 }>
            <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>Add to Cart</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={add_to_cart.bind(this,package_details.id,package_details.package_name,package_details.price,package_details.lab_id)} style={ styles.button1 }>
            <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>Remove to Cart</Text>
          </TouchableOpacity>
        }
        </View>
      </View>
      <View style={{ margin:5 }} />
      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:10 }}/>
        <View style={{ width:'100%', flexDirection:'row'}}>
          <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center' }}>
            <Text style={{ fontSize:13, color:colors.theme_fg_two, fontFamily:bold}}>Need help with a booking?</Text>
            <View style={{ margin:2 }}/>
            <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>We are here</Text>
          </View>
          <View style={{ width:'30%', alignItems:'flex-end', justifyContent:'center' }}>
            <TouchableOpacity onPress={call_admin.bind(this, global.admin_contact_number)} style={ styles.button3}>
              <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular}}>Call us now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ margin:10 }}/>
      </View>
      <View style={{ margin:5 }} />
      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:10 }}/>
        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>This package cover</Text>
        <View style={{ margin:10 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{package_details.test_preparation}</Text>
        <View style={{ margin:10 }}/>
      </View>
      <View style={{ margin:5 }} />
      {lab_process_steps.map((row, index) => (
        <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
          <View style={{ padding:10 }}>
            <View style={{ width:'100%', flexDirection:'row', paddingBottom:15}}>
              <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
                <View style={styles.image_style1} >
                  <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={{ uri: img_url+row.icon}} />
                </View>
              </View>
              <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold}}>{row.title}</Text>
                <View style={{ margin:2 }}/>
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{row.description}</Text>
              </View>
            </View>
          </View>  
        </View>  
      ))}
      <View style={{ margin:20 }} />
    </ScrollView>
    {props.cart_items[package_id] != undefined &&
      <View style={{ position:'absolute', bottom:0, height:60, padding:10, backgroundColor:colors.theme_fg_three, width:'100%'}}>
        <View style={{ width:'100%', flexDirection:'row'}}>
          <TouchableOpacity onPress={ cart } style={{paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:colors.theme_bg,
            width:'100%',
            borderWidth:1}}>
            <Text style={{ fontSize:14, color:colors.theme_fg_three, fontFamily:bold}}>Move to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    }
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:colors.light_grey
  },
  searchBarContainer:{
    borderColor:colors.light_grey, 
    borderRadius:10,
    borderWidth:2, 
    height:45
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
  textFieldIcon: {
    paddingLeft:10,
    paddingRight:5,
    fontSize:20, 
    color:colors.theme_fg
  },
  textField: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    height: 45,
    fontFamily:regular
  },
  border_style: {
    borderBottomWidth:1,
    borderColor:colors.light_blue,
  },
  border_style1: {
    borderBottomWidth:10,
    borderColor:colors.light_blue,
  },
  image_style:{
    height:25, 
    width:25,
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
  button3: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg_two,
    width:'100%',
    borderWidth:1
  },
  button4: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    backgroundColor:colors.theme_fg,
    width:'30%',
    borderWidth:1
  },
  home_style1:{
      paddingTop:10, 
      flexDirection:'row',
  },
  home_style2:{
    borderRadius: 10
  },
  home_style3:{
    height:70, 
    width:130, 
    borderRadius:10, 
    marginRight:10,
  },
  image_style1:{
    height:50, 
    width:50,
  },
  box: {
      borderColor:colors.light_grey,
      borderWidth: 2,
      width:'100%',
      borderRadius: 20,
      backgroundColor:colors.theme_fg_three,
  },
  box_image:{
    alignSelf:'center',
    height:300,
    width:'100%', 
    borderTopLeftRadius: 20,  
    borderTopRightRadius: 20, 
  },
});

function mapStateToProps(state){
  return{
    promo : state.lab_order.promo,
    sub_total : state.lab_order.sub_total,
    cart_items : state.lab_order.cart_items,
    total : state.lab_order.total,
    current_lab_id : state.lab_order.current_lab_id,
    lab_id : state.lab_order.lab_id,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateLabPromo: (data) => dispatch(updateLabPromo(data)),
  updateLabAddToCart: (data) => dispatch(updateLabAddToCart(data)),
  updateLabSubTotal: (data) => dispatch(updateLabSubTotal(data)),
  updateLabCalculateTotal: (data) => dispatch(updateLabCalculateTotal(data)),
  updateLabTotal: (data) => dispatch(updateLabTotal(data)), 
  updateLabId: (data) => dispatch(updateLabId(data)),
  updateCurrentLabId: (data) => dispatch(updateCurrentLabId(data)), 
  labReset: () => dispatch(labReset()),
});

export default connect(mapStateToProps,mapDispatchToProps)(PackageDetail);
