import React, { useRef, useEffect, useState}  from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, TextInput, Image, FlatList  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { bold, regular, api_url, get_nearest_doctors, img_url } from '../config/Constants';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons';

const HospitalSearch = () => {
    const navigation = useNavigation();
    const search_ref = useRef();
    const route = useRoute();
    const [data, setData] = useState([]);
    const [search_txt, setSearchTxt] = useState('');
    const [specialist, setSpecialist] = useState(route.params.specialist);
    const [lat, setLat] = useState(route.params.lat);
    const [lng, setLng] = useState(route.params.lng);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => { search_ref.current.focus() }, 200)
    },[]);

    const handleBackButtonClick= () => {
      navigation.goBack()
    }

    const hospital_details = (data) => {
      navigation.navigate("HospitalDetails",{ data : data});
    }

    const render_nearest_hospitals = ({ item }) => (
      <TouchableOpacity onPress={hospital_details.bind(this,item)} style={{ flexDirection:'row', width:'90%', margin:5, backgroundColor:colors.theme_bg_three, padding:5, marginLeft:'5%', marginRight:'5%', borderRadius:10}}>
        <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
            <Image style={{ width:40, height:40, borderRadius:5 }} source={{ uri:img_url + item.hospital_logo }} />
        </View>
        <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.hospital_name}</Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{item.address}</Text>
        </View>
      </TouchableOpacity>
    );

    const nearest_hospitals = async(search_txt) =>{ 
      if(search_txt != ''){
        setLoading(true);
        await axios({
          method: 'post', 
          url: api_url + get_nearest_doctors,
          data:{ specialist : specialist, lat:lat, lng:lng, search:search_txt }
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
                    placeholder="Search hospitals..."
                    underlineColorAndroid="transparent"
                    onChangeText={text => nearest_hospitals(text)}
                />
            </View>
            <FlatList
              data={data}
              renderItem={render_nearest_hospitals}
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

export default HospitalSearch;