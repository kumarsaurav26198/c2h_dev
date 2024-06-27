import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, Platform, PermissionsAndroid } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux'; 
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag, updateAddress  } from '../actions/CurrentAddressActions';
import Loader from '../components/Loader';

const CurrentLocation = (props) => {

  const navigation = useNavigation(); 
  const mapRef = useRef(null);
  const [mapRegion, setmapRegion] = useState(null);
  const [loading, setLoading] = useState('false');

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
    getInitialLocation();
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
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              let address = await responseJson.results[0].formatted_address;
              await props.updateCurrentAddress(address);
              await props.updateCurrentLat(value.latitude);
              await props.updateCurrentLng(value.longitude);
              await props.currentTag('Current Address');
           }else{
            alert('Sorry something went wrong')
           }
    }) 
  }

  const home = async() => {
    await props.updateAddress(undefined)
    navigation.navigate("Home")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignItems:'center', justifyContent:'center', height:'100%'}} >
        <MapView
          provider={PROVIDER_GOOGLE} 
          ref={mapRef}
          style={{width: '100%',height: '100%'}}
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
        <View style={{position: 'absolute', backgroundColor:colors.theme_fg_three, borderRadius:10, width:'96%', height:50, top:10, flexDirection:'row', padding:10  }}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:30 }} />
          </TouchableOpacity>
          <View style={{ width:'85%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12 }}>{props.current_address}</Text>
          </View>
        </View>
        <View style={{ left:0, right:0, bottom:0, alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
          <TouchableOpacity onPress={home} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Loader visible={loading} />
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
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
    height:45
  },
});

function mapStateToProps(state){
  return{
    current_address : state.current_location.current_address,
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
    current_tag : state.current_location.current_tag,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateAddress: (data) => dispatch(updateAddress(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(CurrentLocation);
