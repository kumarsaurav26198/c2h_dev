import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, PermissionsAndroid, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, height_50, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location, customer_add_address, api_url, customer_update_address, customer_edit_address } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';

const AddAddress = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState('false');
  const [mapRegion, setmapRegion] = useState(null);
  const mapRef = useRef(null);
  const [address, setAddress] = useState('Please select your location...');
  const [pin_code, setPinCode] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0); 
  const [address_id, setAddressId] = useState(route.params.id);
  const [landmark, setLandmark] = useState('');
  const [validation,setValidation] = useState(false); 
  const [location_value, setLocationValue] = useState('');

  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  
  const ref_variable = async() =>{
    await setTimeout(() => {
      mapRef.current.focus();
    }, 200);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await requestCameraPermission();
    });
    return unsubscribe;
  },[]);

  const requestCameraPermission = async() =>{
    if(Platform.OS === "android"){
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': global.app_name+' needs to Access your location for tracking'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await findType();
        } else {
            await handleBackButtonClick();
        }
    } catch (err) {
        await handleBackButtonClick();
    }
    }else{
      await getInitialLocation();
    }
  }

  const findType = async() =>{
    if(address_id == 0){
      getInitialLocation();
    }else{
      edit_address();
    }
  }

  const edit_address = async() =>{
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_edit_address,
      data:{ id: address_id, customer_id: global.id }
    })
    .then(async response => {
      setLoading(false);
      //alert(JSON.stringify(response))
      setLocationValue(response.data.result)
      setLocation(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      console.log('Sorry something went wrong')
    });
  }

  const setLocation = async(data) =>{
    let region = {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lng),
      latitudeDelta:  LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }
    setAddress(data.address);
    setLandmark(data.landmark);
    setmapRegion(region);
    //alert(JSON.stringify(mapRegion))
  }

  const getInitialLocation = async() =>{
    await Geolocation.getCurrentPosition( async(position) => {
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      setmapRegion( region )
      
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  const onRegionChange = async(value) => {
    setAddress( 'Please wait...' );
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              let address = responseJson.results[0].address_components;
              let pin_code = address[address.length - 1].long_name;
              setPinCode(  pin_code );
              setAddress( responseJson.results[0].formatted_address );
              setLatitude(  value.latitude );
              setLongitude(  value.longitude );
           }else{
            setAddress( 'Google can not fetch your location.' );
           }
    }) 
  }  

  const address_validation = async() =>{
    if(landmark == ""){
      alert('Please enter the landmark')
      await setValidation(false);
    }else{
      await setValidation(true);
      add_address();
    }
  }

  const update_address_validation = async() =>{
    if(landmark == ""){
      alert('Please enter the landmark')
      await setValidation(false);
    }else{
      await setValidation(true);
      update_address();
    }
  }

  const add_address = async () => {
    console.log({ customer_id: global.id, address: address.toString(), landmark: landmark, lat: latitude, lng: longitude })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_add_address,
      data:{ customer_id: global.id, address: address.toString(), landmark: landmark, lat: latitude, lng: longitude }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        handleBackButtonClick();
      }else{
        alert(response.data.message);
      }
    })
    .catch(error => {
      setLoading(false);
      console.log('Sorry something went wrong')
    });
    }

  const update_address = async () => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_update_address,
      data:{ id: address_id, customer_id: global.id, address: address.toString(), landmark: landmark, lat: latitude, lng: longitude }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        handleBackButtonClick();
      }
    })
    .catch(error => {
      setLoading(false);
      console.log('Sorry something went wrong')
    });
  }

  return (
    
  <SafeAreaView style={styles.container}>
    <ScrollView style={{ padding:10 }} showsVerticalScrollIndicator={false} >
      <Loader visible={loading} />
      <View style={{alignItems:'center', justifyContent:'center'}} >
        <MapView
          provider={PROVIDER_GOOGLE} 
          ref={mapRef}
          style={{width: '100%',height: height_50}}
          initialRegion={ mapRegion }
          onRegionChangeComplete={region => onRegionChange(region)}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
        </MapView>
        <View style={{position: 'absolute',}}>
          <View style={{height:30, width:25, top:-15 }} >
            <Image
              style= {{flex:1 , width: undefined, height: undefined}}
              source={location}
            />
          </View>
        </View>
      </View>
      <View style={{ marginTop:20 }} />
      <View style={{ margin:10 }} />
      <View style={{ flexDirection:'row' }} >
        <Text style={styles.landmark_label} >LandMark</Text>
      </View> 
      <View
        style={styles.textFieldcontainer}>
        <TextInput
          style={styles.textField}
          placeholder="Enter your landmark"
          underlineColorAndroid="grey"
          onChangeText={text => setLandmark(text)}
          value={landmark}
        />
      </View>
      <View style={{ flexDirection:'row' }} >
        <Text style={{fontSize:15, fontFamily: bold, color:colors.theme_fg_two}} >Address</Text>
      </View>
      <View style={{ flexDirection:'row' }} >
        <Text style={{fontSize:15, marginTop:5,fontFamily: regular}} >
          {address}
        </Text>
      </View>
      <View style={{ marginTop:'35%' }} />
      {address_id == 0 ?
        <View style={{ left:0, right:0, bottom:0, alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
          <TouchableOpacity onPress={address_validation.bind(this)} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>Add Address</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={{ left:0, right:0, bottom:0,alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
          <TouchableOpacity onPress={update_address_validation.bind(this)} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>Update Address</Text>
          </TouchableOpacity>
        </View>
      }
    </ScrollView>
  </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:colors.theme_bg_three,
    flex:1
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
    height: 45
  },
  textField: {
    flex: 1,
    padding: 1,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three
  },
  landmark_label:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg_two 
  },
});

export default AddAddress;
