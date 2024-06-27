import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import {  bold, api_url, upload_prescription, upload_path } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImgToBase64 from 'react-native-image-base64';
import Loader from '../components/Loader';
import { connect } from 'react-redux';

const options = {
    title: 'Select a photo',
    takePhotoButtonTitle: 'Take a photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    base64: true,
    quality:1, 
    maxWidth: 500, 
    maxHeight: 500,
  };

const UploadPrescription = (props) =>{

    const route = useRoute();
	const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [path, setPath] = useState(upload_path);
    const [img_data,setImgData] = useState(""); 
    const [pharm_id, setPharmId] = useState(route.params.pharm_id);

    const select_photo = async () => {
        ImagePicker.launchImageLibrary(options, async(response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const source =  response.assets[0].uri;
            setImgData(response.assets[0].uri)
            ImgToBase64.getBase64String(response.assets[0].uri)
            .then(async base64String => {
                await prescription_upload(base64String);
            }
            )
            .catch(err => console.log(err));
        }
        });
    }

    const prescription_upload = async(data) =>{
        setLoading(true);
        RNFetchBlob.fetch('POST', api_url + upload_prescription, {
          'Content-Type' : 'multipart/form-data',
        }, [
          {  
            name : 'image',
            filename : 'image.png', 
            data: data
          },
          { name : 'customer_id', data : global.id},
          { name : 'vendor_id', data : pharm_id.toString()},
          { name : 'address_id', data : props.address.id.toString()}
        ]).then(async (resp) => {
            setLoading(false);
            const data_resp = JSON.parse(resp.data);
            if(data_resp.status == 1){
                Alert.alert(
                    "Order Success",
                    "Your order successfully placed please wait vendor will contact you shortly",
                    [
                      { text: "OK", onPress: () => navigate_home() }
                    ]
                  );
            }else{
                alert("Error on while upload try again later.")
            }
        }).catch((err) => {
            setLoading(false);
            alert('Error on while upload try again later.')
        })
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
            return <TouchableOpacity onPress={select_photo.bind(this)} style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10}}>
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
            <View style={{ marginBottom:40, alignItems:'center', justifyContent:'center' }}>
                <View style={{ height:200, width:200}}>
                    <Image source={path} style={{ flex:1, height:undefined, width:undefined }} />
                </View>
                <View style={{ margin:10 }} />
                <Text style={{ fontFamily:bold, color:colors.theme_fg, fontSize:16}}>Upload your prescription</Text>
            </View>
            {show_button()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor:colors.theme_bg_three
    }
  });

  function mapStateToProps(state){
    return{
      address : state.current_location.address,
    };
  }
  
  export default connect(mapStateToProps,null)(UploadPrescription);