import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Dimensions, SafeAreaView, Text, ScrollView, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, show_vendor_list, api_url, img_url, get_module_banners } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from '../components/Loader'; 

const Pharmacies = (props) => {

  const navigation = useNavigation();
  const [vendor_list, setVendorList] = useState([]); 
  const [recommended_list, setRecommendedList] = useState([]); 
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false); 

  const view_categories = (pharm_id, vendor_name) => {
    navigation.navigate("PharmCategories",{ pharm_id : pharm_id, vendor_name : vendor_name  });
  }
  useEffect( () => {
    get_pharmacies();
    module_banners();
  },[]);

  const get_pharmacies = async (search) => {
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + show_vendor_list,
      data:{ customer_id : global.id, search:'', lat:props.current_lat, lng:props.current_lng }
    })
    .then(async (response) => {
      setLoading(false);
      if(response.data.status == 1){
        setVendorList(response.data.result.vendor_list);
        setRecommendedList(response.data.result.recommended);
      }
    })
    .catch((error) => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  };

  const module_banners = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_module_banners,
      data:{ app_module : 3 }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setBanners(response.data.result)
      }
    })
    .catch(error => {
      setLoading(false);
      console.log(error)
      alert('Sorry something went wrong');
    });
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

  const renderItem = ({ item }) => (
    <View style={{ padding:10 }}>
      <TouchableOpacity activeOpacity={1} onPress={view_categories.bind(this,item.id,item.store_name)}>
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={10}>
          <View style={styles.box_container}>
            <Image
              style={{ width: '100%', height:180, borderTopLeftRadius:10, borderTopRightRadius:10 }}
              source={{
                  uri: img_url + item.store_image
              }}
            />
            <View style={{ flexDirection:'row', padding:20}}>
              <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16 }}>{item.store_name}</Text>
                <View style={{ margin:2 }} />
                <Text numberOfLines={2} ellipsizeMode='tail' style={{ color:colors.grey, fontFamily:regular, fontSize:12 }}>{item.address}</Text>
              </View>
              <View style={{ width:'20%', alignItems:'flex-end', justifyContent:'flex-end'}}>
                <View style={{ width:50, backgroundColor:'green', padding:5, borderRadius:5, alignItems:'center', justifyContent:'center', flexDirection:'row' }}>
                  {item.overall_ratings > 0 ? 
                    <View style={{ flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                      <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold}}>{item.overall_ratings} </Text>
                      <Icon style={{ color:colors.theme_fg_three, fontSize:10 }} type={Icons.Ionicons} name="star" />
                    </View>
                  :
                    <View>
                      <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold}}>New</Text>
                    </View>
                  }
                </View>
              </View>  
            </View>
          </View>
        </CardView>
      </TouchableOpacity>
    </View>
  );
  
  const search = () =>{ 
      navigation.navigate("PharmacySearch",{ lat:props.current_lat, lng:props.current_lng });
  }

  const show_recommended_vendors = () => { 
    return recommended_list.map((data) => {
      return (
        <CardView
          cardElevation={4}
          cardMaxElevation={4}
          style={{ width:200, margin:10 }}
          cornerRadius={10}>
          <TouchableOpacity activeOpacity={1} onPress={view_categories.bind(this,data.id,data.store_name)} style={{ alignItems: 'center', borderRadius:10, alignItems:'center', justifyContent:'center' }}>
            <View style={{ width:200, height:100 }}>
              <Image source={{ uri : img_url + data.store_image }} style={{ width:undefined, height:undefined, flex:1, borderTopLeftRadius:10, borderTopRightRadius:10 }} />
            </View>
            <View style={{ margin:5 }} />
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>{data.store_name}</Text>
            <View style={{ margin:5 }} />
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ color:colors.grey, fontFamily:regular, fontSize:12 }}>{data.address}</Text>
            <View style={{ margin:10 }} />
          </TouchableOpacity>
        </CardView>
      )
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/*<View style={styles.header}>
        <View style={{ margin:2}}/>
        <View style={{ width:'10%' }}>
          <Icon type={Icons.Ionicons} name="location" color={colors.theme_fg_two} style={{ fontSize:30, color:colors.theme_fg }} />
        </View>
        <View style={{ width:'90%'}}>
          <Text style={{ color:colors.theme_fg_two, fontSize:13, fontFamily:bold }}>{props.current_tag}</Text>
          <Text numberOfLines={1} style={{ color:colors.theme_fg_two, fontSize:12, fontFamily:regular}}>{props.current_address}</Text>
        </View>
      </View>
        <View style={{ margin:10 }} />
      <View style={styles.searchBarContainer}>
        <View
          style={styles.textFieldcontainer}>
          <Icon style={styles.textFieldIcon} type={Icons.Feather} name="search" />
          <TextInput
            style={styles.textField}
            placeholder="Search your favourite restaurants...."
            underlineColorAndroid="transparent"
            onChangeText={text => get_vendor(text)}
          />
        </View>
        </View>
      <View style={{ margin:10 }} />
      <View style={{ flex:1, flexDirection:'row'}}>
        <View style={{ width:'70%', justifyContent:'center'}}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Your Nearest Vendors</Text>
        </View>
        <View style={{ width:'30%', justifyContent:'center' }}>
          <Text style={{ color:colors.theme_fg, fontFamily:regular, alignSelf:'flex-end' }}>View more</Text>
        </View>
      </View>
      <View style={{ margin:10 }} />*/}
      {vendor_list.length > 0 ?
        <View>
          <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={search} activeOpacity={1} style={{height: 45, borderRadius:10, padding:10, borderColor:colors.grey, justifyContent:'center', backgroundColor:colors.light_blue, width:'100%'}}>
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>Search pharmacies...</Text>
          </TouchableOpacity>
          <View style={{ margin:10 }} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {banners_list()}
          </ScrollView>
          <View style={{ margin:10 }} />
          {recommended_list.length > 0 &&
            <View>
              <Text style={{ fontSize:18, color:colors.theme_fg_two, fontFamily:bold}}>Recommended For You</Text>
              <View style={styles.ban_style1}>
                <ScrollView horizontal={true} style={{ padding:10}} showsHorizontalScrollIndicator={false}>
                    {show_recommended_vendors()}
                </ScrollView>
              </View>
            </View>
          }
          <Text style={{ fontSize:18, color:colors.theme_fg_two, fontFamily:bold}}>Nearest Pharmacies</Text>
          <View style={{ margin:5 }} />
            <FlatList
              data={vendor_list}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <View style={{ margin:20 }} />
          </ScrollView>
        </View>
      :
        <View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
           <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no data found</Text>
        </View>
      }
      <Loader visible={loading} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  box_container:{
    borderRadius:10,
  },
  home_style2:{
    borderRadius: 10
  },
  home_style3:{
    height:150, 
    width:280, 
    borderRadius:10, 
    marginRight:10,
  }
  
});

function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}

export default connect(mapStateToProps,null)(Pharmacies);