import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, api_url, get_doctor_categories, img_url, regular, get_module_banners, get_nearest_doctors} from '../config/Constants';
import { useNavigation,  useRoute } from '@react-navigation/native';
import axios from 'axios';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview';
import StarRating from 'react-native-star-rating';
import Icon, { Icons } from '../components/Icons';

const Hospital = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [is_error, setError] = useState(0);
  const [type, setType] = useState(route.params.type);
  const [doctor_list, setDoctorList] = useState([]);
  const [recommended_list, setRecommendedList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const nearest_doctors = async() =>{ 
    console.log({ lat:props.current_lat, lng:props.current_lng, search:'' })
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_nearest_doctors,
      data:{ lat:props.current_lat, lng:props.current_lng, search:'' }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setDoctorList(response.data.result.doctor_list)
        setRecommendedList(response.data.result.recommended)
      }
    })
    .catch(error => {
      setLoading(false);
      console.log(error)
      alert('Sorry something went wrong');
    });
  }

  const module_banners = async() =>{
    await axios({
      method: 'post', 
      url: api_url + get_module_banners,
      data:{ app_module : 2 }
    })
    .then(async response => {
      if(response.data.status == 1){
        setBanners(response.data.result)
      }
    })
    .catch(error => {
      console.log(error)
      alert('Sorry something went wrong');
    });
  } 

  const hospital_details = (data) =>{
    navigation.navigate("HospitalDetails",{ data : data});
  }

  const search = () =>{
    navigation.navigate("HospitalSearch",{ lat:props.current_lat, lng:props.current_lng });
  }

  useEffect(() => {
    get_categories(); 
    module_banners();
    nearest_doctors();
  },[]);

  const view_all = (title,type,data) => {
    navigation.navigate("ViewList",{ data : data, title : title, type : type });
  }

  const banners_list = () => { 
    return banners.map((data) => {
      return (
        <TouchableOpacity activeOpacity={1}>
          <ImageBackground  source={{ uri : img_url + data.url }} imageStyle={styles.home_style2} style={styles.home_style3} />
        </TouchableOpacity>
      )
    });
  }

  const categories_list = () => { 
    return categories.map((data) => {
      return (
        <TouchableOpacity onPress={navigate.bind(this,data.id)} style={{ alignItems:'center', margin:5, width:120, backgroundColor:colors.theme_bg_three, borderRadius:10, padding:5}}>
          <View style={{ margin:5 }} />
          <Image style={{ height: 50, width: 50, flex:1, borderRadius:10 }} source={{ uri : img_url + data.category_image}}/>
          <View style={{ margin:5 }} />
          <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_two}}>{data.category_name}</Text>
          <View style={{ margin:5 }} />
        </TouchableOpacity>
      )
    });
  }

  const render_recommended_hospitals = ({ item }) => (
    <View style={{ marginBottom:20, margin:5, width:200 }} >
      <TouchableOpacity activeOpacity={1} onPress={hospital_details.bind(this,item)}>
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={10}>
          <View style={{ width:'100%', alignItems:'center', backgroundColor:colors.theme_fg_three , padding:15, borderRadius:10 }} >
            <View style={{ width:120, alignItems:'flex-start', justifyContent:'center' }} >
              <View style={{ height: 90, width: '100%', borderWidth:1, borderRadius:10, borderColor:colors.theme_fg_three }} >
                <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10, }} source={{ uri:img_url + item.hospital_logo }}/>
              </View> 
            </View>
            <View style={{ margin:5 }} />
            <View style={{ justifyContent:'flex-start' }} >
              <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>{item.hospital_name}</Text>
              <View style={{margin:5}}/>
              {item.type == 1 ?
                <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.warning, borderRadius:10, padding:3, textAlign:'center' }}>Hospital</Text>
                :
                <Text style={{ fontSize:12, color:colors.theme_bg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.warning, borderRadius:10, padding:3, textAlign:'center' }}>Clinic</Text>
              }
            </View>
          </View>
          <View style={{ width:'90%', marginLeft:'5%', flexDirection:'row', paddingLeft:10, paddingRight:10, alignItems:'center'}}>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{item.address}</Text>
          </View>
          <View style={{ margin:5 }} />
        </CardView>
      </TouchableOpacity>
    </View>
  );

  const render_nearest_doctors = ({ item }) => (
    <View style={{ marginBottom:20, margin:5 }} >
      <View >
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={10}>
          <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.theme_fg_three , padding:15, borderRadius:10 }} >
            <View style={{ width:120, alignItems:'flex-start', justifyContent:'center' }} >
              <View style={{ height: 90, width: 90, borderWidth:1, borderRadius:10, borderColor:colors.theme_fg_three }} >
                <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10, }} source={{ uri:img_url + item.hospital_logo }}/>
              </View> 
            </View>
            <View style={{ justifyContent:'flex-start' }} >
              <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>{item.hospital_name}</Text>
              <View style={{ margin:3 }} />
              <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{item.opening_time} - {item.closing_time}</Text>
              <View style={{margin:5}}/>
              {item.type == 1 ?
                <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.warning, borderRadius:10, padding:3, textAlign:'center' }}>Hospital</Text>
                :
                <Text style={{ fontSize:12, color:colors.theme_bg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.warning, borderRadius:10, padding:3, textAlign:'center' }}>Clinic</Text>
              }
            </View>
          </View>
          <View style={{ width:'100%', flexDirection:'row', paddingLeft:10, paddingRight:10}}>
            <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{item.address}</Text>
          </View>
          <View style={{ width:'100%', flexDirection:'row', padding:10}}>
            <View style={{ width:'100%', alignItems:'flex-end', justifyContent:'center'}}>
              <TouchableOpacity onPress={hospital_details.bind(this,item)} style={{ width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:colors.regular_blue, borderRadius:5, padding:10}}>
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:12}}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CardView>
      </View>
    </View>
  );

  return (
  <SafeAreaView style={styles.container}>
    <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {banners_list()}
      </ScrollView>
      <View style={{ margin:10 }} />
      <TouchableOpacity onPress={search} activeOpacity={1} style={{height: 45, borderRadius:10, padding:10, borderColor:colors.grey, justifyContent:'center', backgroundColor:colors.theme_bg_three, width:'100%' }}>
          <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>Search hospitals...</Text>
      </TouchableOpacity>
      <View style={{ margin:10 }} />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}>
          {categories_list()}
      </ScrollView>
      <View style={{ margin:10 }} />
      <View style={{ flexDirection:'row'}}>
        <View style={{ alignSelf:'flex-start', width:'75%'}}>
          <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_two}}>Recomended For you</Text>
        </View>
        <View style={{ alignSelf:'flex-end', width:'25%'}}>
          <Text onPress={view_all.bind(this,'Recomended For you',1,recommended_list)} style={{ fontSize:12, color:colors.theme_bg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.badge_bg, borderRadius:10, padding:3, textAlign:'center' }}>View All</Text>
        </View>         
      </View>
      <View style={{ margin:5 }} />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <FlatList
            data={recommended_list}
            renderItem={render_recommended_hospitals}
            keyExtractor={item => item.id}
          />
        </ScrollView>
        <View style={{ flexDirection:'row'}}>
        <View style={{ alignSelf:'flex-start', width:'75%'}}>
          <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_two}}>Nearest Hospital</Text>
        </View>
        <View style={{ alignSelf:'flex-end', width:'25%'}}>
          <Text onPress={view_all.bind(this,'Nearest Hospital',1,doctor_list)} style={{ fontSize:12, color:colors.theme_bg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.badge_bg, borderRadius:10, padding:3, textAlign:'center' }}>View All</Text>
        </View>         
      </View>
      <View style={{ margin:5 }} />
      <FlatList
        data={doctor_list}
        renderItem={render_nearest_doctors}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.light_blue,
  },
  home_style2:{
    borderRadius: 10
  },
  home_style3:{
    height:180, 
    width:280, 
    borderRadius:10, 
    marginRight:10
  },
});

function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}
export default connect(mapStateToProps,null)(Hospital);