import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, img_url, bold } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview';

const ViewList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState(route.params.title);
  const [type, setType] = useState(route.params.type);
  const [data, setData] = useState(route.params.data);
  
  const hospital_details = (data) =>{
    navigation.navigate("HospitalDetails",{ data : data});
  }

  const create_appointment = (doctor_details) => {
    navigation.navigate("CreateAppointment", { doctor_details : doctor_details, appointment_fee:doctor_details.appointment_fee });
  }

  const navigate_lab_details = (id,name) =>{
    navigation.navigate("LabDetails", {lab_id:id, lab_name:name})
  }

  return (
    <SafeAreaView style={styles.container}>
    {type == 1 &&
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingRight:10, paddingTop:10 }}>
            <FlatList 
            data={data}
            numColumns={3}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={hospital_details.bind(this,item)} style={{ backgroundColor:colors.theme_bg_three, borderRadius:10, width:'33%', alignItems:'center', justifyContent:'center', maxWidth: Dimensions.get('window').width /2, flex:0.5, marginBottom: 10, margin:5 }}>
                <View style={{ width:'100%', height:200 }}>
                    <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{ uri : img_url + item.hospital_logo}}/>
                </View>
                <View style={{ margin:5 }} /> 
                <View style={{ padding:5 }}>
                <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>{item.hospital_name}</Text>
                  <View style={{margin:5}}/>
                  {item.type == 1 ?
                    <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.badge_bg, borderRadius:10, padding:3, textAlign:'center' }}>Hospital</Text>
                    :
                    <Text style={{ fontSize:12, color:colors.theme_bg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.badge_bg, borderRadius:10, padding:3, textAlign:'center' }}>Clinic</Text>
                  }
                </View>
                <View style={{ margin:5 }} /> 
                </TouchableOpacity>
            )}
            />
        </View>
    }
    {type == 2 &&
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingRight:10, paddingTop:10 }}>
            <FlatList 
            data={data}
            numColumns={3}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={create_appointment.bind(this,item)} style={{ backgroundColor:colors.theme_bg_three, borderRadius:10, width:'33%', alignItems:'center', justifyContent:'center', maxWidth: Dimensions.get('window').width /2, flex:0.5, marginBottom: 10, margin:5 }}>
                <View style={{ width:'100%', height:200 }}>
                    <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{ uri : img_url + item.profile_image}}/>
                </View>
                <View style={{ margin:5 }} /> 
                <View style={{ padding:5 }}>
                    <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>Dr.{item.doctor_name}</Text>
                    <View style={{margin:5}}/>
                    <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.badge_bg, borderRadius:10, padding:3, textAlign:'center' }}>{item.qualification}</Text>
                </View>
                <View style={{ margin:5 }} /> 
                </TouchableOpacity>
            )}
            />
        </View>
    }
    {type == 3 &&
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingRight:10, paddingTop:10 }}>
            <FlatList 
            data={data}
            numColumns={3}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={create_appointment.bind(this,item)} style={{ backgroundColor:colors.theme_bg_three, borderRadius:10, width:'33%', alignItems:'center', justifyContent:'center', maxWidth: Dimensions.get('window').width /2, flex:0.5, marginBottom: 10, margin:5 }}>
                <View style={{ width:'100%', height:200 }}>
                    <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{ uri : img_url + item.profile_image}}/>
                </View>
                <View style={{ margin:5 }} /> 
                <View style={{ padding:5 }}>
                    <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>Dr.{item.doctor_name}</Text>
                    <View style={{margin:5}}/>
                    <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold, letterSpacing:0.5, backgroundColor:colors.badge_bg, borderRadius:10, padding:3, textAlign:'center' }}>{item.qualification}</Text>
                </View>
                <View style={{ margin:5 }} /> 
                </TouchableOpacity>
            )}
            />
        </View>
    }
    {type == 4 &&
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingRight:10, paddingTop:10 }}>
            <FlatList 
            data={data}
            numColumns={3}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={navigate_lab_details.bind(this, item.id, item.lab_name)} style={{ backgroundColor:colors.theme_bg_three, borderRadius:10, width:'33%', alignItems:'center', justifyContent:'center', maxWidth: Dimensions.get('window').width /2, flex:0.5, marginBottom: 10, margin:5 }}>
                <View style={{ width:'100%', height:200 }}>
                    <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{ uri : img_url + item.lab_image}}/>
                </View>
                <View style={{ margin:5 }} /> 
                <View style={{ padding:5 }}>
                    <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold}}>{item.lab_name}</Text>
                    <View style={{margin:5}}/>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{item.address}</Text>
                    <View style={{margin:5}}/>
                </View>
                <View style={{ margin:5 }} /> 
                </TouchableOpacity>
            )}
            />
        </View>
    }
    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.light_blue,
  },
  description: {
    padding:10
  }
});

export default ViewList;
