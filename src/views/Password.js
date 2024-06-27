import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, api_url, customer_login, customer_forget_password } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfilePicture  } from '../actions/CurrentAddressActions';
import { connect } from 'react-redux'; 

const Password = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState('false');
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [validation,setValidation] = useState(false); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const login_validation = async() =>{
    if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else{
      await setValidation(true);
      login();
    }
  }

  const login = async() => {
    console.log({ phone_with_code: phone_with_code_value , fcm_token:global.fcm_token, password: password })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_login,
      data:{ phone_with_code: phone_with_code_value , fcm_token:global.fcm_token, password: password }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else if(response.data.status == 0){
        alert('Please enter correct Password')
      }
    })
    .catch(error => {
      setLoading(false);
      console.log(error)
      alert('Sorry something went wrong');
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('customer_name', data.result.customer_name.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('email', data.result.email.toString());
        await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());
        
        global.id = await data.result.id.toString();
        global.customer_name = await data.result.customer_name.toString();
        global.phone_number = await data.result.phone_number.toString();
        global.phone_with_code = await data.result.phone_with_code.toString();
        global.email = await data.result.email.toString();
        await props.updateProfilePicture(data.result.profile_picture);
        
        await navigate();
      }catch (e) {
        alert(e);
    }
  }

  const navigate = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

  const forgot_password = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_forget_password,
      data:{ phone_with_code: phone_with_code_value }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigation.navigate('Otp',{ data : response.data.result.otp, type: 2, id : response.data.result.id })
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

return (
 <SafeAreaView style={styles.container}>
    <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false}>
      <View>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Welcome to {app_name}</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Please enter your password to access your account</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Enter your password"
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={login_validation} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <TouchableOpacity onPress={forgot_password}> 
          <Text style={{ color:colors.theme_fg, fontFamily:regular, alignSelf:'center', fontSize:12}}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
});

function mapStateToProps(state){
  return{
    profile_picture : state.current_location.profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Password);