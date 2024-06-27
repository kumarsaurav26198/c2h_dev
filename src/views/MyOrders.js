import React, { useState } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, online_consult, clinic, lab, tablet, login_entry_img} from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation,  useRoute } from '@react-navigation/native';

const MyOrders = () => {

  const navigation = useNavigation();
  const route = useRoute();

  const list = [
    {
      menu_name:'My Online Consults',
      description:'Consult now or view your past consultations',
      icon:clinic,
      route:'MyOnlineConsultations'
    },
    {
      menu_name:'My Clinic Appointments',
      description:'Book or view your past appointments',
      icon:online_consult,
      route:'MyAppointments'
    },
    {
      menu_name:'Medicine Delivery',
      description:'Delivered at your doorstep',
      icon:tablet,
      route:'MyOrderHistories'
    },
    {
      menu_name:'Lab Tests',
      description:'Collected at your doorstep',
      icon:lab,
      route:'LabOrders'
    }
  ]

  const navigate =(route) =>{
    navigation.navigate(route);
  }

  const navigate_login = () =>{
    navigation.navigate("CheckPhone")
  }

  const show_list = () => { 
    return list.map((data) => {
      return (
        <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this,data.route)} style={{ padding:10 }} >
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={10}>
            <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.theme_fg_three , padding:20, borderRadius:10 }} >
              <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center' }} >
                <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold }}>{data.menu_name}</Text>
                <View style={{ margin:2 }} />
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>{data.description}</Text>
              </View>
              <View style={{ width:'20%', alignItems:'flex-end', justifyContent:'center' }} >
                <View style={{ height: 50, width: 50, }}>
                  <Image style={{ height: undefined, width: undefined, flex:1 }} source={data.icon}/>
                </View>
              </View>
            </View>
          </CardView>
        </TouchableOpacity>
      )
    });
  }

  return (
    <View>
      {global.id == 0 ?
        <TouchableOpacity onPress={navigate_login} style={styles.null_container}>
          <Image source={login_entry_img} style={{ height:'50%', width:'70%' }}/>
          <View style={{margin:10}}/>
          <Text style={{ fontFamily:bold, fontSize:16, color:colors.theme_bg_two}}>Click to Login</Text>
        </TouchableOpacity>
        :
          <SafeAreaView style={styles.container}>
            <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
              <View style={{ margin:10 }} /> 
              {show_list()}
              <View style={{ margin:50 }} />
            </ScrollView>
          </SafeAreaView>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor:colors.light_blue,
  },
  null_container: {
    height:'100%',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
  },
});

export default MyOrders;