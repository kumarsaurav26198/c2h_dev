import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, Dimensions, TouchableOpacity, FlatList  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, api_url, get_doctor_categories, img_url} from '../config/Constants';
import { useNavigation,  useRoute } from '@react-navigation/native';
import axios from 'axios';

const DoctorCategories = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [categories, setCategories] = useState([]);
  const [is_error, setError] = useState(0);
  const [type, setType] = useState(route.params.type);

  const navigate = (specialist) => {
    navigation.navigate("DoctorList",{ specialist : specialist, type:type })
  }

  const get_categories = async() =>{
    await axios({
      method: 'get', 
      url: api_url + get_doctor_categories
    })
    .then(async response => {
      if(response.data.status == 1){
        setCategories(response.data.result)
      }else{
        setError(1);
      }
    })
    .catch(error => {
      console.log(error)
      alert('Sorry something went wrong');
    });
  }

  useEffect(() => {
    get_categories(); 
  },[]);

  /*const categories_list = () => { 
    return categories.map((data) => {
      return (
        <TouchableOpacity onPress={navigate.bind(this,data.id)} style={{ width:'100%', flexDirection:'row', borderBottomWidth:1, borderColor:colors.light_grey, padding:10 }}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Image style={{ height: 50, width: 50, flex:1, borderRadius:10 }} source={{ uri : img_url + data.category_image}}/>
          </View> 
          <View style={{ margin:10 }} />
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold, textAlign:'center'}}>{data.category_name}</Text>
          </View> 
        </TouchableOpacity>
      )
    });
  }*/

  const categories_list = () => { 
    return categories.map((data) => {
      return (
        <TouchableOpacity onPress={navigate.bind(this,data.id)} style={{ backgroundColor:colors.theme_bg_three, borderRadius:10, width:130, height:150, alignItems:'center', justifyContent:'center'}}>
          <View style={{ width:100, height:100 }}>
            <Image style={{ height: undefined, width: undefined, flex:1 }} source={{ uri : img_url + data.category_image}}/>
          </View> 
          <View style={{ margin:5 }} />
          <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold, textAlign:'center'}}>{data.category_name}</Text>
        </TouchableOpacity>
      )
    });
  }
  return (
  <SafeAreaView style={styles.container}>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingRight:10, paddingTop:10 }}>
      <FlatList 
        data={categories}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={navigate.bind(this,item.id)} style={{ backgroundColor:colors.theme_bg_three, borderRadius:10, width:'33%', alignItems:'center', justifyContent:'center', maxWidth: Dimensions.get('window').width /2, flex:0.5, marginBottom: 10, margin:5 }}>
            <View style={{ width:'100%', height:100 }}>
              <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{ uri : img_url + item.category_image}}/>
            </View>
            <View style={{ margin:5 }} /> 
            <View style={{ padding:5 }}>
              <Text numberOfLines={1} style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold, textAlign:'center'}}>{item.category_name}</Text>
            </View>
            <View style={{ margin:5 }} /> 
          </TouchableOpacity>
        )}
      />
    </View>
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.light_blue,
  },
});

export default DoctorCategories;