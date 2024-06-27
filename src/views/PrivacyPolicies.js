import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, customer_privacy_policy, api_url} from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ContentLoader from "react-native-easy-content-loader";

const PrivacyPolicies = () => {
  const navigation = useNavigation();
  const [privacy_result, setPrivacyResult] = useState([]);
  const [loading, setLoading] = useState('false');

  useEffect(() => {
    get_privacy(); 
  },[]);

  const get_privacy = async() => {
    setLoading(true);
    axios({
    method: 'post', 
    url: api_url + customer_privacy_policy,
    data:{ user_type:global.user_type }
    })
    .then(async response => {
      setLoading(false);
      setPrivacyResult(response.data.result)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  } 

  const renderItem = ({ item }) => (
    <View>
      <View style={{ justifyContent:'center', alignItems:'flex-start', padding:10,}}>
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>{item.title}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>{item.description}</Text>
      </View>
    </View>
  );
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ margin:10}} />
      <ContentLoader 
        pRows={1}
        pHeight={[10, 30, 20]}
        pWidth={['80%', 70, 100]}
        listSize={5}
        loading={loading}>
        <FlatList
          data={privacy_result}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ContentLoader>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
    justifyContent:'flex-start'
  },
  logo:{
    height:120, 
    width:120,
  },
   
});

export default PrivacyPolicies;
