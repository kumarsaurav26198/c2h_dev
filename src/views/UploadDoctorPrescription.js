import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import {  bold, api_url, upload_doctor_prescription } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Loader from '../components/Loader'; 
import axios from 'axios';
import { connect } from 'react-redux';
import { updatePrescriptionDetails, updatePrescriptionId  } from '../actions/PrescriptionOrderActions';
import { Badge } from 'react-native-elements';

const UploadDoctorPrescription = (props) =>{
    const route = useRoute();
	const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [pharm_id, setPharmId] = useState(route.params.pharm_id);

    const prescription_upload = async(data) =>{
        console.log({ customer_id : global.id, prescription_id:props.prescription_id.toString(), address_id:props.address.id.toString(), vendor_id:pharm_id.toString()})
        setLoading(true);
        await axios({
        method: "post",
        url: api_url + upload_doctor_prescription,
        data:{ customer_id : global.id, prescription_id:props.prescription_id.toString(), address_id:props.address.id.toString(), vendor_id:pharm_id.toString()}
        })
        .then(async (resp) => {
            setLoading(false);
            console.log(resp)
            Alert.alert(
                "Order Success",
                "Your order successfully placed, please wait vendor will contact you shortly",
                [
                  { text: "OK", onPress: () => navigate_home() }
                ]
              );
        })
        .catch((error) => {
            setLoading(false);
            alert('Sorry something went wrong');
        });
    }

    const navigate_home = () =>{
        navigation.dispatch(
            CommonActions.reset({
               index: 0,
               routes: [{ name: "Home" }],
           })
       );
    }

    const select_address = () =>{
        if(global.id == 0){
            navigation.navigate("CheckPhone")
        }else{
            navigation.navigate("AddressList", { from : 'cart'} )
        }
    }

    const show_button = () =>{
        if(props.address){
            return <TouchableOpacity onPress={prescription_upload.bind(this)} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
                    <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
                        Upload Prescription
                    </Text>
                </TouchableOpacity>
        }else{
            return <TouchableOpacity onPress={select_address.bind(this)} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
                    <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>
                        Select Address
                    </Text>
                </TouchableOpacity>
        }
            
    }
	return(
        <SafeAreaView style={styles.container}>
            <Loader visible={loading}/>
            <ScrollView>
                <View>
                <FlatList
                    data={props.prescription_details}
                    renderItem={({ item,index }) => (
                    <View style={{flexDirection:'row', padding:20}}>
                        <View style={{alignItems:'flex-start', justifyContent:'center', width:'49%'}}>
                        <Text style={{fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.medicine_name}</Text>
                        </View>
                        <View style={{margin:5}}/>
                        <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'center', width:'49%'}}>
                        <View style={styles.prescription_style8}>
                            {item.morning == 1 ? 
                            <Badge status="success" value="M" badgeStyle={{width:40, height:20}}/>
                            :
                            <Badge status="error" value="M" badgeStyle={{width:40, height:20}}/>
                            }
                            <View style={styles.prescription_style8} />
                            {item.afternoon == 1 ? 
                            <Badge status="success" value="A" badgeStyle={{width:40, height:20}}/>
                            :
                            <Badge status="error" value="A" badgeStyle={{width:40, height:20}}/>
                            }
                            <View style={styles.prescription_style9} />
                            {item.evening == 1 ? 
                            <Badge status="success" value="E" badgeStyle={{width:40, height:20}}/>
                            :
                            <Badge status="error" value="E" badgeStyle={{width:40, height:20}}/>
                            }
                            <View style={styles.prescription_style10} />
                            {item.night == 1 ? 
                            <Badge status="success" value="N" badgeStyle={{width:40, height:20}}/>
                            :
                            <Badge status="error" value="N" badgeStyle={{width:40, height:20}}/>
                            }
                        </View>
                        </View>
                    </View>
                    )}
                    keyExtractor={item => item.question}
                />
                </View>
            </ScrollView>
            {show_button()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor:colors.theme_bg_three
    },
    prescription_style2: { justifyContent:'flex-end', alignItems:'flex-end'},
    prescription_style3: {color:colors.theme_fg_two},
    prescription_style6: { fontSize:25, color:colors.theme_fg_two,  fontFamily: bold},
    prescription_style7: {color:colors.theme_fg_five, marginTop:5},
    prescription_style8:{margin:2, flexDirection:'row'},
    prescription_style9:{margin:2, flexDirection:'row'},
    prescription_style10:{margin:2, flexDirection:'row'},
    prescription_style11: { color:colors.theme_fg_two, fontSize:30},
    container: {
    flex: 1,
    backgroundColor:colors.theme_fg_three,
    },
    button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
    marginBottom:'5%',
    },
  });

  function mapStateToProps(state){
    return{
      address : state.current_location.address,
      prescription_details : state.prescription_order.prescription_details,
      prescription_id : state.prescription_order.prescription_id,
    };
  }

  const mapDispatchToProps = (dispatch) => ({
	updatePrescriptionDetails: (data) => dispatch(updatePrescriptionDetails(data)),
    updatePrescriptionId: (data) => dispatch(updatePrescriptionId(data)), 
  });
  
export default connect(mapStateToProps,mapDispatchToProps)(UploadDoctorPrescription);