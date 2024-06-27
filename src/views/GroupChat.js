import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, logo_with_name, settings, api_url } from '../config/Constants';
import { useNavigation,  useRoute } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';

const GroupChat = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(route.params.type);

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
      <Text>Coming Soon</Text>
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

export default GroupChat;
