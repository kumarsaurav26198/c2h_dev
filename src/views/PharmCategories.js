import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, light_colors, pharmacy_sub_categories, pharmacy_categories, api_url, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview';
import axios from 'axios';
import Loader  from '../components/Loader';
import { updatePrescriptionDetails, updatePrescriptionId  } from '../actions/PrescriptionOrderActions';
import { connect } from 'react-redux'; 

const PharmCategories = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pharm_id, setPharmId] = useState(route.params.pharm_id);
  const [active_category, setActiveCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [sub_categories, setSubCategories] = useState([]);  
  const [category_name, setCategoryName] = useState('');  

  useEffect(() => {
   get_categories();
  },[]);

  const get_categories = async() => {
    console.log({vendor_id:pharm_id})
    axios({
    method: 'post', 
    url: api_url + pharmacy_categories,
    data:{vendor_id:pharm_id},
    })
    .then(async response => {
      if(response.data.result.length > 0){
        setCategories(response.data.result);
        change_category(response.data.result[0].id,response.data.result[0].category_name)
      }
    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }

  const view_products = (sub_category_id, sub_category_name) => {
    navigation.navigate("PharmProducts",{ pharm_id : pharm_id, category_id : active_category, sub_category_id : sub_category_id, sub_category_name:sub_category_name  });
  }

  const get_sub_categories = async(category_id) => {
    console.log({vendor_id:pharm_id, category_id:category_id})
    axios({
    method: 'post', 
    url: api_url + pharmacy_sub_categories,
    data:{vendor_id:pharm_id, category_id:category_id},
    })
    .then(async response => {
      setSubCategories(response.data.result);
    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }

  const change_category = (category_id,category_name) =>{
    setActiveCategory(category_id)
    setCategoryName(category_name);
    get_sub_categories(category_id)
  }

  const upload_prescription = () =>{
    navigation.navigate("UploadPrescription",{pharm_id : pharm_id});
  }

  const upload_doctor_prescription = () =>{
    navigation.navigate('UploadDoctorPrescription',{pharm_id : pharm_id})
  }

  const show_categories = () => {
    return categories.map((data) => {
      return (
        <View>
          <TouchableOpacity activeOpacity={1} onPress={change_category.bind(this,data.id,data.category_name)}>
            <CardView
              style={[ active_category == data.id ? styles.active_category_bg : styles.inactive_category_bg]}
              cardElevation={5}
              cardMaxElevation={5}
              cornerRadius={10}>
              <View  style={{  width:100, alignItems:'center', justifyContent:'center' }}>
                <Image source={{ uri : img_url + data.category_image}} style={{ height:50, width:50 }} />
                <View style={{ margin:5 }} />
                <Text style={[ active_category == data.id ? styles.active_category_fg : styles.inactive_category_fg]}>{data.category_name}</Text>
              </View>
            </CardView>
          </TouchableOpacity>
        </View>
      )
    })
  }

  const show_sub_categories = () => {
    return sub_categories.map((data,index) => {
      return (
        <TouchableOpacity activeOpacity={1} onPress={view_products.bind(this,data.id,data.sub_category_name)} style={{ flexDirection:'row', marginBottom:10, padding:10, backgroundColor:light_colors[index], borderRadius:10, borderLeftWidth:5, borderColor:colors.theme_fg}}>
          <View style={{ width:'60%', padding:10}}>
            <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold}}>{data.sub_category_name}</Text>
            <View style={{ margin:10 }} />
            <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:regular, textDecorationLine: 'underline'}}>View Products</Text>
          </View>
          <View style={{ width:'40%', alignItems:'flex-end'}}>
            <Image source={{ uri:img_url + data.image }} style={{ height:100, width:100, borderRadius:10}} />
          </View>
        </TouchableOpacity>
      )
    })
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}>
          {show_categories()}
        </ScrollView>
        <View style={{ margin:10 }} />
        <TouchableOpacity activeOpacity={1} onPress={upload_prescription} style={{ height:40, bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', borderRadius:10}}>
          <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
              Upload Prescription
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold}}>{category_name}</Text>
        <View style={{ margin:10 }} />
          {show_sub_categories()}
      </ScrollView>
      {props.prescription_id &&
        <View style={{ padding:10 }}>
          <TouchableOpacity activeOpacity={1} onPress={upload_doctor_prescription} style={{ height:40, bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', borderRadius:10}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
                Upload Doctor Prescription
            </Text>
          </TouchableOpacity>
        </View>
      }
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  active_category_bg:{
    margin:5, 
    padding:10, 
    backgroundColor:colors.theme_bg
  },
  active_category_fg:{
    fontSize:12, 
    color:colors.theme_fg_three, 
    fontFamily:regular
  },
  inactive_category_bg:{
    margin:5, 
    padding:10, 
    backgroundColor:colors.light_blue
  },
  inactive_category_fg:{
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:regular
  }
});

function mapStateToProps(state){
	return{
		prescription_details : state.prescription_order.prescription_details,
    prescription_id : state.prescription_order.prescription_id, 
  
	};
  }
  
  const mapDispatchToProps = (dispatch) => ({
	updatePrescriptionDetails: (data) => dispatch(updatePrescriptionDetails(data)),
  updatePrescriptionId: (data) => dispatch(updatePrescriptionId(data)), 
  });

  export default connect(mapStateToProps,mapDispatchToProps)(PharmCategories);
