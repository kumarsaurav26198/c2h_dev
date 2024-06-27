import React, { useRef, useEffect, useState}  from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, TextInput, Image, FlatList  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { bold, regular, api_url, get_online_doctors, img_url, create_consultation } from '../config/Constants';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons';
const DoctorSearch = () => {
    const navigation = useNavigation();
    const search_ref = useRef();
    const route = useRoute();
    const [data, setData] = useState([]);
    const [search_txt, setSearchTxt] = useState('');
    const [specialist, setSpecialist] = useState(route.params.specialist);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => { search_ref.current.focus() }, 200)
    },[]);

    const handleBackButtonClick= () => {
      navigation.goBack()
    }

    const set_data = (doctor_id,amount) =>{
      let data = {
        patient_id:global.id,
        doctor_id:doctor_id,
        total:amount
      }
      payment_methods(data);
    }

    const payment_methods = (data) => {
      navigation.navigate("PaymentMethods", { type : 2, amount : data.total, data:data, route:create_consultation, from:'doctor_list' });
    }

    const render_online_doctors = ({ item }) => (
      <TouchableOpacity onPress={set_data.bind(this,item.id, item.consultation_fee)} style={{ flexDirection:'row', width:'90%', margin:5, backgroundColor:colors.theme_bg_three, padding:5, marginLeft:'5%', marginRight:'5%', borderRadius:10}}>
        <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
            <Image style={{ width:40, height:40, borderRadius:5 }} source={{ uri:img_url + item.profile_image }} />
        </View>
        <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.doctor_name}</Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{ item.qualification } - { item.experience } Years of experience</Text>
        </View>
      </TouchableOpacity>
    );

    const online_doctors = async(search_txt) =>{ 
      if(search_txt != ''){
        setLoading(true);
        await axios({
          method: 'post', 
          url: api_url + get_online_doctors,
          data:{ specialist : specialist, search:search_txt }
        })
        .then(async response => {
          setLoading(false);
          if(response.data.status == 1){
            setData(response.data.result)
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
                    placeholder="Search doctors..."
                    underlineColorAndroid="transparent"
                    onChangeText={text => online_doctors(text)}
                />
            </View>
            <FlatList
              data={data}
              renderItem={render_online_doctors}
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

export default DoctorSearch;