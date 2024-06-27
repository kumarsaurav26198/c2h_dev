import React, { useRef, useEffect, useState}  from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, TextInput, Image, FlatList  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { bold, regular, api_url, show_vendor_list, img_url } from '../config/Constants';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons';

const PharmacySearch = () => {
    const navigation = useNavigation();
    const search_ref = useRef();
    const route = useRoute();
    const [data, setData] = useState([]);
    const [search_txt, setSearchTxt] = useState('');
    const [lat, setLat] = useState(route.params.lat);
    const [lng, setLng] = useState(route.params.lng);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => { search_ref.current.focus() }, 200)
    },[]);

    const handleBackButtonClick= () => {
      navigation.goBack()
    }

    const view_categories = (pharm_id, vendor_name) => {
        navigation.navigate("PharmCategories",{ pharm_id : pharm_id, vendor_name : vendor_name  });
    }

    const render_nearest_pharmacies = ({ item }) => (
      <TouchableOpacity onPress={view_categories.bind(this,item.id,item.store_name)} style={{ flexDirection:'row', width:'90%', margin:5, backgroundColor:colors.theme_bg_three, padding:5, paddingTop:10, paddingBottom:10, marginLeft:'5%', marginRight:'5%', borderRadius:10}}>
        <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
            <Image style={{ width:50, height:50, borderRadius:5 }} source={{ uri:img_url + item.store_image }} />
        </View>
        <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.store_name}</Text>
            <View style={{ margin:2 }} />
            <Text numberOfLines={2} style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{item.address}</Text>
        </View>
      </TouchableOpacity>
    );

    const find_pharmacies = async(search_txt) =>{ 
      if(search_txt != ''){
        setLoading(true);
        await axios({
          method: 'post', 
          url: api_url + show_vendor_list,
          data:{ lat:lat, lng:lng, search:search_txt }
        })
        .then(async response => {
          setLoading(false);
          if(response.data.status == 1){
            setData(response.data.result)
          }else{
            setData([])
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          alert('Sorry something went wrong');
        });
      }else{
        setData([]);
      }
    }
    
    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleBackButtonClick.bind(this)} style={{ alignSelf:'flex-end', margin:10}}>
              <Icon type={Icons.Ionicons} name="close" style={{ fontSize:25, color:colors.theme_fg_two }} />
            </TouchableOpacity>
            <View
            style={styles.textFieldcontainer}>
                <TextInput
                    style={styles.textField}
                    ref={search_ref}
                    placeholder="Search pharmacies..."
                    underlineColorAndroid="transparent"
                    onChangeText={text => find_pharmacies(text)}
                />
            </View>
            <FlatList
              data={data}
              renderItem={render_nearest_pharmacies}
              keyExtractor={item => item.id}
            />
        </SafeAreaView>  
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
    width:'90%',
    marginLeft:'5%'
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three
  },
});

export default PharmacySearch;