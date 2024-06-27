import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, logo_with_name, settings, api_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';

const AboutUs = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [type, setType] = useState(route.params.type);
  const [loading, setLoading] = useState(false);
  const [app_details, setAppDetails] = useState("");

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await app_settings();
    });
    return unsubscribe;
    
  },[]);

  const app_settings = async() => {
    axios({
    method: 'get', 
    url: api_url + settings,
    })
    .then(async response => {
      setAppDetails(response.data.result)
    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }

  return (
    <SafeAreaView style={styles.container}>
    <Loader visible={loading} />
      <View style={{ height:'100%'}}>
        <View style={{ margin:10 }} />
        <View style={{justifyContent:'center', alignItems:'center'}} >
          <View style={styles.logo} >
            <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={logo_with_name} />
          </View>
        </View>
        <View style={{ margin:10 }} />
        <View style={{padding:10}}>
          <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14 }}>{app_details.description}</Text>
        </View>
        <View style={{ margin:10 }} />
        <View style={{ padding:10,alignItems:'center'}}>
          <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14 }}>About app version {app_details.app_version}</Text>
        </View>
        <View style={{ width:'100%', flexDirection:'row',height:60, padding:10, backgroundColor:colors.light_grey, position:'absolute', bottom:0}}>
          <View style={{ width:'10%',justifyContent:'center', alignItems:'center' }}>
            <Icon type={Icons.Ionicons} name="home-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
          </View>  
          <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:regular, fontSize:12, color:colors.regular_grey}}>{app_details.address}</Text>   
          </View>
        </View>
      </View>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
    justifyContent:'flex-start'
  },
  header: {
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
    padding:10
  },
  logo:{
    height:120, 
    width:120,
  },
   
});

export default AboutUs;
