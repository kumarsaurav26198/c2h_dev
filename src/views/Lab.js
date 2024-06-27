import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Dimensions, SafeAreaView, Text, ScrollView, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, customer_lab_list, api_url, img_url } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader  from '../components/Loader';
import { updateAddress, updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag  } from '../actions/CurrentAddressActions';
import { connect } from 'react-redux';

const Lab = (props) => {
  const navigation = useNavigation();
  const [banners, setBanners] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [nearest, setNearest] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      show_lab_list();
    });
    return unsubscribe;
  },[]);

  const show_lab_list = () =>{
    setLoading(true);
    axios({
    method: 'post', 
    url: api_url + customer_lab_list,
    data:{ lat:props.current_lat, lng:props.current_lng, search:'' }
    })
    .then(async response => {
      setLoading(false);
      setBanners(response.data.result.banners);
      setRecommended(response.data.result.recommended);
      setNearest(response.data.result.nearest);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const call_admin = async(number) =>{
    let phoneNumber = '';
    if (Platform.OS === 'android'){ 
      phoneNumber = `tel:${number}`; 
    }else{
      phoneNumber = `telprompt:${number}`; 
    }
    await Linking.openURL(phoneNumber);
  }

  const navigate_lab_details = (id,name) =>{
    navigation.navigate("LabDetails", {lab_id:id, lab_name:name})
  }

  const search = () =>{ 
    navigation.navigate("LabSearch",{ lat:props.current_lat, lng:props.current_lng });
  }

  return (
  <SafeAreaView style={styles.container}>
  <Loader visible={loading} />
    <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={search} activeOpacity={1} style={{height: 45, borderRadius:10, padding:10, borderColor:colors.grey, justifyContent:'center', backgroundColor:colors.light_blue, width:'100%'}}>
            <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>Search labs...</Text>
        </TouchableOpacity>
        <View style={styles.home_style1}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {banners.map((row, index) => (
              <ImageBackground source={{ uri: img_url+row.url }} imageStyle={styles.home_style2} style={styles.home_style3} />
            ))}
          </ScrollView>
        </View>
      <View style={{ margin:10 }} />
      <View style={{ flex:1, flexDirection:'row'}}>
        <View style={{ width:'100%', justifyContent:'center'}}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Recomended For you</Text>
        </View>
      </View>
      <View style={{ paddingTop:10 }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false} >
          {recommended.map((row, index) => (
            <TouchableOpacity activeOpacity={1} onPress={navigate_lab_details.bind(this, row.id, row.lab_name)} style={{ width:150, margin:10}}>
              <CardView
              cardElevation={5}
              cardMaxElevation={5}
              cornerRadius={10}>
              <View style={styles.list_container}>
                <View style={{ width: 150, height:100, }}>
                  <Image
                    style={{  flex:1, height:undefined, width:undefined, borderTopLeftRadius:10, borderTopRightRadius:10 }}
                    source={{ uri: img_url+row.lab_image }}
                  />
                </View>
                <View style={{ flexDirection:'row', padding:10, backgroundColor:colors.theme_fg_three}}>
                  <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:12 }}>{row.lab_name}</Text>
                    <View style={{ margin:2 }} />
                    <Text numberOfLines={1} style={{ color:colors.grey, fontFamily:regular, fontSize:10 }}>{row.address}</Text>
                  </View>
                </View>
              </View>
              </CardView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ margin:10 }} />
      <View style={{ flexDirection:'row', margin:10, borderWidth:1, borderColor:colors.light_blue, padding:20, borderRadius:10, backgroundColor:colors.light_blue }}>
        <View style={{ width:'60%' , alignItems:'flex-start'}}>
          <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:12}}>Need help with a booking ?</Text>
          <View style={{ margin:2 }} />
          <Text style={{ fontFamily:bold, color:colors.grey, fontSize:10}}>We are waiting for you...  :)</Text>
        </View>
        <View style={{ width:'40%', alignItems:'flex-end'}}>
          <TouchableOpacity onPress={call_admin.bind(this, global.admin_phone_number)} style={{ borderColor:colors.theme_fg, borderWidth:1, borderRadius:10, padding:10, alignItems:'center', justifyContent:'center' }}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:12}}>Call us now</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ margin:10 }} />
      <View style={{ flex:1, flexDirection:'row'}}>
        <View style={{ width:'100%', justifyContent:'center'}}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Nearest Laboratories</Text>
        </View>
      </View>
      <View style={{ margin:10 }} />
      {nearest.map((row, index) => (
        <TouchableOpacity activeOpacity={1} onPress={navigate_lab_details.bind(this, row.id, row.lab_name)} style={{ padding:10 }}>
          <CardView
            cardElevation={5}
            cardMaxElevation={5}
            cornerRadius={10}>
            <View style={styles.list_container}>
              <Image
                style={{ width: '100%', height:180, borderTopLeftRadius:10, borderTopRightRadius:10 }}
                source={{ uri: img_url+row.lab_image }}
              />
              <View style={{ flexDirection:'row', padding:20, backgroundColor:colors.theme_fg_three}}>
                <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center'}}>
                  <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14 }}>{row.lab_name}</Text>
                  <View style={{ margin:2 }} />
                  <View style={{ flexDirection:'row'}}>
                    <Icon type={Icons.Ionicons} name="location" color={colors.theme_fg_two} style={{ fontSize:14, color:colors.theme_fg_two }} />
                    <View style={{ margin:2 }} />
                    <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12 }}>{row.address}</Text>
                  </View>
                </View>
              </View>
            </View>
          </CardView>
        </TouchableOpacity>
      ))}
      <View style={{ margin:50 }} />
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor:colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  searchBarContainer:{
    borderColor:colors.light_grey, 
    borderRadius:10,
    borderWidth:2, 
    height:45
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
  textFieldIcon: {
    paddingLeft:10,
    paddingRight:5,
    fontSize:20, 
    color:colors.theme_fg
  },
  textField: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    height: 45,
    fontFamily:regular
  },
  list_container:{
    borderRadius:10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: (Dimensions.get('window').width / 3) - 17,
    padding: 5,
    margin:5,
    borderRadius:20
  },
  categoryImage: {
    height: 50,
    width: 50,
  },
  categoryTitle: {
    fontSize: 12,
    marginTop: 10,
    fontFamily:bold
  },
  img_style1:{
    flexDirection:'row'
  },
  img_style2:{
    borderRadius: 10
  },
  img_style3:{
    height:60, 
    width:60, 
    borderRadius:10, 
    marginRight:10
  },
  home_style1:{
      paddingTop:10, 
      flexDirection:'row'
    },
    home_style2:{
      borderRadius: 10
    },
    home_style3:{
      height:140, 
      width:260, 
      borderRadius:10, 
      marginRight:10
    },
});

function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
    current_address : state.current_location.current_address,
    current_tag : state.current_location.current_tag,
    address : state.current_location.address,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateAddress: (data) => dispatch(updateAddress(data)), 
  
});

export default connect(mapStateToProps,mapDispatchToProps)(Lab);