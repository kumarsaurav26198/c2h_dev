import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, customer_get_address, api_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux'; 
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag, updateAddress  } from '../actions/CurrentAddressActions';
import Loader from '../components/Loader';
import axios from 'axios';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const SelectCurrentLocation = (props) => {

  const navigation = useNavigation();
  const [address_value, setAddressValue] = useState([]); 
  const [loading, setLoading] = useState('false');

  const current_location = async(id) => {
    if (Platform.OS === "android"){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
          navigation.navigate("CurrentLocation")
        }).catch(err => {
        
      });
    }else{
      navigation.navigate("CurrentLocation")
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_address();
    });
    return unsubscribe;
  },[]);

  const get_address = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_get_address,
      data:{ customer_id: global.id }
    })
    .then(async response => {
      setLoading(false);
      setAddressValue(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const set_current_address = async(data) =>{
    await props.updateCurrentAddress(data.address);
    await props.updateCurrentLat(data.lat);
    await props.updateCurrentLng(data.lng);
    await props.currentTag('Current Address');
    await props.updateAddress(data);
    home();
  }

  const home= () => {
    navigation.navigate("Home") 
  }
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={set_current_address.bind(this,item)} style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, padding:15}}>
      <View style={{ width:'90%', justifyContent:'center', alignItems:'flex-start'}}>
        <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{item.address}</Text>   
      </View> 
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
        <Loader visible={loading} />
        <View style={{ margin:10 }} />
        <TouchableOpacity onPress={current_location} style={{ flexDirection:'row'}}>
          <View style={{ width:'10%',justifyContent:'flex-start', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="compass" color={colors.red} style={{ fontSize:25 }} />
          </View>  
          <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:bold, fontSize:16, color:colors.red}}>Use current location </Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>Marudhu Pandiar Nagar</Text>   
          </View>
          <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end' }}>
           <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:20 }} />
          </View>
        </TouchableOpacity>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16 }}> Saved Addresses</Text>
        <FlatList
          data={address_value}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
});

function mapStateToProps(state){
  return{
    current_address : state.current_location.current_address,
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
    current_tag : state.current_location.current_tag,
    address : state.current_location.address,
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateAddress: (data) => dispatch(updateAddress(data)),

});

export default connect(mapStateToProps,mapDispatchToProps)(SelectCurrentLocation);

