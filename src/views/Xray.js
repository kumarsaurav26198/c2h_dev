import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Dimensions, SafeAreaView, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, customer_xray_list, api_url, img_url, customer_last_active_address } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar';
import axios from 'axios';
import { updateAddress } from '../actions/LabOrderActions';
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag  } from '../actions/CurrentAddressActions';
import { connect } from 'react-redux';
import Loader  from '../components/Loader';

const Xray = (props) => {
  const navigation = useNavigation();
  const [xray_list, setXrayList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_address();
    });
    return unsubscribe;
  },[]);

  const show_xray_list = () =>{
    console.log({lat:props.current_lat, lng:props.current_lng})
    setLoading(true);
    axios({
    method: 'post', 
    url: api_url + customer_xray_list,
    data:{ lat:props.current_lat, lng:props.current_lng }
    })
    .then(async response => {
      setLoading(false);
      setXrayList(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const get_address = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_last_active_address,
      data:{ customer_id : global.id }
    })
    .then(async response => {
      await setLoading(false);
      if(response.data.status == 1){
        update_last_active_address(response.data.result);
      }else{
        show_xray_list();
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const update_last_active_address = async(address) =>{
    if(address && !props.address){
      await props.updateAddress(address);
      await props.updateCurrentAddress(address.address);
      await props.updateCurrentLat(address.lat);
      await props.updateCurrentLng(address.lng);
      await props.currentTag(address.type_name);
      await show_lab_list();
    }
  }

  const set_address = () =>{
    navigation.navigate("SelectCurrentLocation")
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

  const navigate_lab_details = (id,name) =>{
    navigation.navigate("LabDetails", {lab_id:id, lab_name:name})
  }

  return (
  <SafeAreaView style={styles.container}>
  <StatusBar/>
  <Loader visible={loading} />
    <ScrollView showsVerticalScrollIndicator={false}>
     <View style={styles.header}>
      <View style={{ width:'10%' }}>
        <Icon type={Icons.Ionicons} name="location" color={colors.theme_fg_two} style={{ fontSize:25, color:colors.theme_fg }} />
      </View>
      <TouchableOpacity onPress={set_address} style={{ width:'80%'}}>
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold }}>{props.current_tag}</Text>
        <Text numberOfLines={1} style={{ color:colors.theme_fg_two, fontSize:12, fontFamily:regular}}>{props.current_address}</Text>
      </TouchableOpacity>
    </View>
    <View style={{ margin:10 }}/>
      <View style={{ flex:1, flexDirection:'row', margin:10}}>
        <View style={{ width:'100%', justifyContent:'center'}}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Nearest Laboratories</Text>
        </View>
      </View>
      {xray_list.map((row, index) => (
        <TouchableOpacity activeOpacity={1} onPress={navigate_lab_details.bind(this, row.id, row.lab_name)} style={{ padding:10 }}>
          <CardView
            cardElevation={5}
            cardMaxElevation={5}
            cornerRadius={10}>
            <View style={styles.list_container}>
              <Image
                style={{ width: '100%', height:180, borderTopLeftRadius:10, borderTopRightRadius:10 }}
                source={{ uri: img_url+row.lab_image }}
              />
              <View style={{ flexDirection:'row', padding:20, backgroundColor:colors.theme_fg_three}}>
                <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center'}}>
                  <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14 }}>{row.lab_name}</Text>
                  <View style={{ margin:2 }} />
                  <View style={{ flexDirection:'row'}}>
                    <Icon type={Icons.Ionicons} name="location" color={colors.theme_fg_two} style={{ fontSize:14, color:colors.theme_fg_two }} />
                    <View style={{ margin:2 }} />
                    <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12 }}>{row.address}</Text>
                  </View>
                </View>
              </View>
            </View>
          </CardView>
        </TouchableOpacity>
      ))}
      <View style={{ margin:50 }} />
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor:colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
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
  list_container:{
    borderRadius:10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: (Dimensions.get('window').width / 3) - 17,
    padding: 5,
    margin:5,
    borderRadius:20
  },
  categoryImage: {
    height: 50,
    width: 50,
  },
  categoryTitle: {
    fontSize: 12,
    marginTop: 10,
    fontFamily:bold
  },
  img_style1:{
    flexDirection:'row'
  },
  img_style2:{
    borderRadius: 10
  },
  img_style3:{
    height:60, 
    width:60, 
    borderRadius:10, 
    marginRight:10
  },
  home_style1:{
      paddingTop:10, 
      flexDirection:'row'
    },
    home_style2:{
      borderRadius: 10
    },
    home_style3:{
      height:140, 
      width:260, 
      borderRadius:10, 
      marginRight:10
    },
});

function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
    current_address : state.current_location.current_address,
    current_tag : state.current_location.current_tag,
    address : state.lab_order.address,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateAddress: (data) => dispatch(updateAddress(data)),
  
});

export default connect(mapStateToProps,mapDispatchToProps)(Xray);
