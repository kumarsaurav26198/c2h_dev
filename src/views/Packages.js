import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, customer_lab_packages, api_url, img_url } from '../config/Constants';
import { useNavigation, useRoute  } from '@react-navigation/native';
import CardView from 'react-native-cardview';
import Icon, { Icons } from '../components/Icons';
import axios from 'axios';
import Loader  from '../components/Loader';

const Packages = (props) => { 

  const navigation = useNavigation();
  const route = useRoute();
  const [lab_id, setLabId] = useState(route.params.lab_id);
  const [relevance_id, setRelevanceId] = useState(route.params.relevance_id);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const package_detail = (package_id, package_name) => {
    navigation.navigate("PackageDetail",{ package_id : package_id, package_name:package_name, lab_id:lab_id })
  }

  useEffect(() => {
    get_lab_packages();
  },[]);

  const get_lab_packages = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_lab_packages,
      data:{ lab_id:lab_id, relevance_id:relevance_id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setData(response.data.result)
      }
    })
    .catch( async error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const renderItem = ({ item }) => (
    <View style={styles.box}>
      <CardView
        cardElevation={5}
        cardMaxElevation={5}
        cornerRadius={10}>
        <View style={{ padding:10, width:'100%', flexDirection:'row' }}>
          <View style={{ width:'35%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
            <View style={styles.image} >
              <Image style= {{ height: undefined,width: undefined,flex: 1, borderRadius:10 }} source={{ uri:img_url + item.package_image }} />
            </View>  
          </View>
          <View style={{ width:'65%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:12}}>{ item.package_name }</Text>
            <View style={{ margin:5 }}/>
            <Text numberOfLines={2} style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{ item.short_description }</Text>
            <View style={{ margin:5 }}/>
            <View style={{ flexDirection:'row', width:'100%' }}>
              <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center' }}>
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14}}>{global.currency}{ item.price }</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ justifyContent:'center', paddingLeft:10, paddingRight:10, paddingBottom:10 }}>
          <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={10}>
            <TouchableOpacity onPress={package_detail.bind(this, item.id, item.package_name)} style={ styles.button }>
              <Icon type={Icons.Ionicons} name="add" color={colors.theme_fg_three} style={{ fontSize:18, fontFamily:bold }} />
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>View Details</Text>
            </TouchableOpacity>
          </CardView>
        </View>
      </CardView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={data}
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
    justifyContent:'flex-start',
  },
   image_style:{
    width:70,
    height:70,
    borderRadius:10,
    borderWidth:1,
    borderColor:colors.theme_fg
  },
  box: {
    margin:5,
  },
   pickup_location:{ 
    fontSize:12, 
    color:colors.grey, 
    fontFamily:bold,
    marginLeft:5 
  },
  drop_location:{ 
    fontSize:12, 
    color:colors.grey, 
    fontFamily:bold,
    marginLeft:5  
  },
  image:{
    height:95, 
    width:95,
    borderWidth:1,
    borderRadius:10,
    borderColor:colors.light_grey
  },
  button: {
    padding:10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%'
  },
});


export default Packages;
