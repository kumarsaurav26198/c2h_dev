import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, correct, certified, api_url, customer_lab_package_details, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateLabPromo, updateLabAddToCart, updateLabSubTotal, updateLabCalculateTotal, updateLabTotal, updateLabId, updateCurrentLabId, labReset } from '../actions/LabOrderActions';
import Loader  from '../components/Loader';

const DoctorProfile = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [doctor, setDoctor] = useState(route.params.doctor_details); 


return (
  <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ padding:10, width:'100%', flexDirection:'row', backgroundColor:colors.theme_bg_three }}>
        <View style={{ width:'50%', paddingTop:10}}>
          <View style={styles.image_style} >
            <Image style= {{ height: undefined,width: undefined,flex: 1, borderRadius:10}} source={{uri: img_url + doctor.profile_image}} />
          </View>
          <View style={{ margin:5}}/>
          <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_two, textAlign:'center'}}>Dr.{doctor.doctor_name}</Text>
          <Text style={{ fontSize:12, fontFamily:regular, color:colors.grey, textAlign:'center'}}>{doctor.experience} Years Experiences</Text>
        </View>
        <View style={{ width:'50%', paddingTop:10}}>
          <Text style={{ fontFamily:bold, fontSize:15, color:colors.grey}}>Speacialist</Text>
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{doctor.specialist}</Text>
          <View style={{ margin:5}}/>
          <Text style={{ fontFamily:bold, fontSize:15, color:colors.grey}}>Sub Specialist</Text>
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{doctor.sub_specialist}</Text>
          <View style={{ margin:5}}/>
          <Text style={{ fontFamily:bold, fontSize:15, color:colors.grey}}>Gender</Text>
          {doctor.gender == 1 ? 
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>Male</Text>
          :
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>Female</Text>
          }
          <View style={{ margin:5}}/>
          <Text style={{ fontFamily:bold, fontSize:15, color:colors.grey}}>Qualification</Text>
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{doctor.qualification} / {doctor.additional_qualification}</Text>
        </View>
      </View>
      <View style={{ margin: 5}} />
      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:5 }}/>
          <View style={{ width:'100%', textAlign:'center', justifyContent:'center' }}>
            <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>About</Text>
            <View style={{ margin:2 }}/>
            <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{doctor.description}</Text>
          </View>
        <View style={{ margin:5 }}/>
      </View>
      <View style={{ margin:5 }} />
      {/*<View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:5 }}/>
        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>Services At</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Mercy Hospital st. Louis</Text>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Delhi, India</Text>
        <View style={{ margin:5 }}/>
      </View>
      <View style={{ margin:5 }} />
      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:5 }}/>
        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>Services</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Diabetes Test</Text>
        <View style={{ margin:5 }}/>
      </View>
      <View style={{ margin:5 }} />
      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:5 }}/>
        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>Specialisation</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>General Physician Test</Text>
        <View style={{ margin:5 }}/>
        </View>*/}
      <View style={{ margin:20 }} />
    </ScrollView>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:colors.light_grey
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
  border_style: {
    borderBottomWidth:1,
    borderColor:colors.light_blue,
  },
  border_style1: {
    borderBottomWidth:10,
    borderColor:colors.light_blue,
  },
  image_style:{
    height:150, 
    width:150,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'49%',
    borderWidth:1
  },
   button1: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    width:'49%',
    borderWidth:1
  },
  button3: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg_two,
    width:'100%',
    borderWidth:1
  },
  button4: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    backgroundColor:colors.theme_fg,
    width:'30%',
    borderWidth:1
  },
  home_style1:{
      paddingTop:10, 
      flexDirection:'row',
  },
  home_style2:{
    borderRadius: 10
  },
  home_style3:{
    height:70, 
    width:130, 
    borderRadius:10, 
    marginRight:10,
  },
  image_style1:{
    height:50, 
    width:50,
  },
  box: {
      borderColor:colors.light_grey,
      borderWidth: 2,
      width:'100%',
      borderRadius: 20,
      backgroundColor:colors.theme_fg_three,
  },
  box_image:{
    alignSelf:'center',
    height:300,
    width:'100%', 
    borderTopLeftRadius: 20,  
    borderTopRightRadius: 20, 
  },
});

function mapStateToProps(state){
  return{
    promo : state.lab_order.promo,
    sub_total : state.lab_order.sub_total,
    cart_items : state.lab_order.cart_items,
    total : state.lab_order.total,
    current_lab_id : state.lab_order.current_lab_id,
    lab_id : state.lab_order.lab_id,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateLabPromo: (data) => dispatch(updateLabPromo(data)),
  updateLabAddToCart: (data) => dispatch(updateLabAddToCart(data)),
  updateLabSubTotal: (data) => dispatch(updateLabSubTotal(data)),
  updateLabCalculateTotal: (data) => dispatch(updateLabCalculateTotal(data)),
  updateLabTotal: (data) => dispatch(updateLabTotal(data)), 
  updateLabId: (data) => dispatch(updateLabId(data)),
  updateCurrentLabId: (data) => dispatch(updateCurrentLabId(data)), 
  labReset: () => dispatch(labReset()),
});

export default connect(mapStateToProps,mapDispatchToProps)(DoctorProfile);
