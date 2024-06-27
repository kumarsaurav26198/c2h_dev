import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, logo_with_name, customer_lab_detail, api_url, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview';
import axios from 'axios';
import Loader  from '../components/Loader';
import { connect } from 'react-redux';
import { updatePromo } from '../actions/LabOrderActions';

const LabDetails = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [relevances, setRelevances] = useState([]);
    const [popular_packages, setPopularPackages] = useState([]);
    const [common_packages, setCommonPackages] = useState([]);
    const [common_packages_list, setCommonPackagesList] = useState([]);
    const [active_common_package, setActiveCommonPackage] = useState(0);  
    const [lab_id, setLabId] = useState(route.params.lab_id);
    const [lab_name, setLabName] = useState(route.params.lab_name);

    const view_all_packages = (id) => {
        navigation.navigate("Packages",{ lab_id : lab_id, relevance_id : id})
    }

    const package_details = (id, package_name) => {
        navigation.navigate("PackageDetail",{ package_id : id, package_name:package_name, lab_id : lab_id, });
    }

    useEffect(() => {
        get_lab_details();
    },[]);

    const get_lab_details = async() => {
        setLoading(true);
        await axios({
            method: 'post', 
            url: api_url + customer_lab_detail,
            data:{ lab_id:lab_id }
        })
    .then(async response => {
        setLoading(false);
        setPopularPackages(response.data.result.popular_packages);
        setCommonPackages(response.data.result.common_packages);
        setRelevances(response.data.result.relevances);
        setCommonPackagesList(response.data.result.common_packages[0].data);
        setActiveCommonPackage(response.data.result.common_packages[0].id);
      
    })
    .catch( async error => {
        setLoading(false);
        alert('Sorry something went wrong')
    });
  }

  const find_active_common_package = async() =>{
      if(common_packages.length){
          setActiveCommonPackage(common_packages[0].id);
      }
  }

  const show_common_packages_list = async(row) =>{
      setActiveCommonPackage(row.id);
      setCommonPackagesList(row.data);
  }

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
    <Loader visible={loading}/>
      <ScrollView>
        <TouchableOpacity onPress={handleBackButtonClick} activeOpacity={1} style={{ backgroundColor:colors.theme_bg, padding:10}}>
          <View style={{ width:'10%' }}>
            <Icon type={Icons.Ionicons} name="arrow-back" style={{ fontSize:25, color:colors.theme_fg_three }} />
          </View>
          <View style={{ flexDirection:'row'}}>
            <View style={{ width:'49%', alignItems:'center', justifyContent:'center'}}>
              <Image style={{ height:150, width:150 }} source={logo_with_name} />
            </View>
            <View style={{ width:'2%', borderLeftWidth:1, borderColor:colors.theme_fg_three, height:100, alignSelf:'center' }} />
            <View style={{ width:'49%', alignItems:'center', justifyContent:'center'}}>
              <Text style={{ fontFamily:bold, fontSize:20, color:colors.theme_fg_three}}>{lab_name}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {popular_packages.length > 0 ?
          <View>
          <View style={{ backgroundColor:colors.theme_bg_three, padding:20}}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Popular Packages</Text>
            <View style={{ margin:5 }} />
            <View style={{ flexDirection:'row' }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false} >
                  {popular_packages.map((row, index) => (
                    <TouchableOpacity activeOpacity={1} onPress={package_details.bind(this,row.id, row.package_name)} style={{ width:150, margin:10}}>
                      <CardView
                      cardElevation={5}
                      cardMaxElevation={5}
                      cornerRadius={10}>
                        <View style={styles.list_container}>
                          <View style={{ width: 150, height:100, }}>
                            <Image
                              style={{  flex:1, height:undefined, width:undefined, borderTopLeftRadius:10, borderTopRightRadius:10 }}
                              source={{ uri: img_url+row.package_image}}
                            />
                          </View>
                          <View style={{ flexDirection:'row', padding:10, backgroundColor:colors.theme_fg_three}}>
                            <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center'}}>
                              <Text numberOfLines={1} style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:12 }}>{row.package_name}</Text>
                              <View style={{ margin:2 }} />
                              <Text numberOfLines={1} style={{ color:colors.grey, fontFamily:regular, fontSize:10 }}>{row.short_description}</Text>
                              <View style={{ margin:2 }} />
                              <Text numberOfLines={1} style={{ color:colors.theme_fg, fontFamily:bold, fontSize:12 }}>{global.currency}{row.price}</Text>
                            </View>
                          </View>
                        </View>
                      </CardView>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </View>
          <View style={{ margin:5 }} />
          </View>
          :
          <View style={{ backgroundColor:colors.theme_bg_three}}>
            <Text></Text>
            <View style={{ margin:5 }} />
          </View>
        }
        {relevances.length > 0 ?
          <View>
            <View style={{ backgroundColor:colors.theme_bg_three, padding:20}}>
              <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Find by relevences</Text>
              <View style={{ margin:5 }} />
              <View style={{ flexDirection:'row' }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false} >
                    {relevances.map((row, index) => (
                      <TouchableOpacity onPress={view_all_packages.bind(this,row.id)} activeOpacity={1} style={{ alignItems:'center', justifyContent:'center', margin:10}}>
                        <View style={{ height:80, width:80}}>
                          <Image style={{ flex:1, height:80, width:80, borderRadius:40 }} source={{ uri : img_url+row.relevance_icon }} />
                        </View>
                        <View style={{ margin:5}} />
                        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>{row.relevance_name}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
              <View style={{ margin:10 }} />
              <TouchableOpacity onPress={view_all_packages.bind(this,0)} style={{ alignItems:'center', justifyContent:'center', padding:10, width:'96%', marginLeft:'2%', marginRight:'2%', borderWidth:1, borderColor:colors.theme_fg_two, borderRadius:10}}>
                <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg}}>View All Packages</Text>
              </TouchableOpacity>
            </View>
            <View style={{ margin:5 }} />
          </View>
          :
          <View style={{ backgroundColor:colors.theme_bg_three}}>
            <Text></Text>
            <View style={{ margin:5 }} />
          </View>
        }
        {common_packages.length > 0 &&
          <View style={{ backgroundColor:colors.theme_bg_three, padding:20}}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>Common packages</Text>
            <View style={{ margin:5 }} />
            <View style={{ paddingTop:10, flexDirection:'row' }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {common_packages.map((row, index) => (
                  <TouchableOpacity style={ (active_common_package == row.id) ? styles.active_badge : styles.inactive_badge} onPress={show_common_packages_list.bind(this, row)}>
                    <Text style={ (active_common_package == row.id) ? styles.active_tag : styles.inactive_tag}>{row.tag_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{ margin:5 }} />
            {common_packages_list.length > 0 ?
              <View style={{ flexDirection:'row' }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false} >
                    {common_packages_list.map((row, index) => (
                      <TouchableOpacity activeOpacity={1} onPress={package_details.bind(this,row.id, row.package_name)} style={{ width:150, margin:10}}>
                        <CardView
                        cardElevation={5}
                        cardMaxElevation={5}
                        cornerRadius={10}>
                          <View style={styles.list_container}>
                            <View style={{ width: 150, height:100, }}>
                              <Image
                                style={{  flex:1, height:undefined, width:undefined, borderTopLeftRadius:10, borderTopRightRadius:10 }}
                                source={{ uri: img_url+row.package_image }}
                              />
                            </View>
                            <View style={{ flexDirection:'row', padding:10, backgroundColor:colors.theme_fg_three}}>
                              <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center'}}>
                                <Text numberOfLines={1} style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:12 }}>{row.package_name}</Text>
                                <View style={{ margin:2 }} />
                                <Text numberOfLines={1} style={{ color:colors.grey, fontFamily:regular, fontSize:10 }}>{row.short_description}</Text>
                                <View style={{ margin:2 }} />
                                <Text numberOfLines={1} style={{ color:colors.theme_fg, fontFamily:bold, fontSize:12 }}>{global.currency}{row.price}</Text>
                              </View>
                            </View>
                          </View>
                        </CardView>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
              :
              <View style={{ backgroundColor:colors.theme_bg_three, padding:20}}>
                <Text style={{fontSize:14, fontFamily:bold, alignItems:'center', textAlign:'center'}}>No packages found</Text>
              <View style={{ margin:5 }} />
          </View>
            }
          </View>
        }
      </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:colors.light_grey
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    margin:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
  active_badge:{
    marginRight:5,
    marginLeft:5,
    backgroundColor:colors.theme_bg,
    borderRadius:10
  },
  inactive_badge:{
    marginRight:5,
    marginLeft:5,
    backgroundColor:colors.theme_bg_three,
    borderRadius:10
  },
  active_tag:{ 
    fontSize:12, 
    color:colors.theme_fg_three, 
    fontFamily:bold, 
    borderWidth:0.5, 
    padding:10, 
    borderRadius:10, 
    borderColor:colors.grey
  },
  inactive_tag:{ 
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:bold, 
    borderWidth:0.5, 
    padding:10, 
    borderRadius:10, 
    borderColor:colors.grey
  }
});

function mapStateToProps(state){
  return{
  };
}

const mapDispatchToProps = (dispatch) => ({
  updatePromo: (data) => dispatch(updatePromo(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(LabDetails);
