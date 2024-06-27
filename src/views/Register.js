import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, api_url, customer_registration, regular } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Loader from '../components/Loader';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfilePicture  } from '../actions/CurrentAddressActions';
import { connect } from 'react-redux'; 

const Register = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 
  const [customer_name, setCustomerName] = useState("");
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code_value);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number_value);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender,setGender] = useState("");
  const [blood_group,setBloodGroup] = useState("");

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const phone_reference = () =>{
    setTimeout(() => {
      phone_ref.current.focus();
    }, 200);
  }

  const check_validation = async() => {
    if(!customer_name || !password || !email ){
      await setValidation(false);
      alert('Please fill all the details.')
    }else{
      await setValidation(true);
      register();
    }
  }

  const register = async() => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_registration,
      data:{ customer_name: customer_name, phone_with_code: phone_with_code_value, phone_number: phone_number_value, password: password, fcm_token: global.fcm_token, email:email,
      gender:gender, blood_group:blood_group }
    })
    .then(async response => {
      console.log(JSON.stringify(response))
      setLoading(false);
      if(response.data.status == 0){
        alert(response.data.message)
      }else{
        saveData(response.data)
      }
      
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
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

  const select_gender = (value) =>{
    setGender(value)
  }

  return( 
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding:20}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <Loader visible={loading} />
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold }}>Register</Text>
        <View style={{ margin:10 }}/>
        <View>
          <View style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Customer Name"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => setCustomerName(text)}
            />
          </View>
          <View style={{ margin:10 }}/>
            <View style={styles.phoneFieldcontainer}>
              <TextInput
                style={styles.textField}
                placeholder="Email"
                placeholderTextColor={colors.grey}
                underlineColorAndroid="transparent"
                onChangeText={text => setEmail(text)}
              />
          </View>
          <View style={{ margin:10 }}/>
          <View style={styles.phoneFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Blood Group"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => setBloodGroup(text)}
            />
          </View>
          <View style={{ margin:10 }}/>
          <View style={styles.phoneFieldcontainer}>
            <Picker
              selectedValue={gender}
              style={styles.textField}
              dropdownIconColor={colors.theme_fg}
              onValueChange={(itemValue, itemIndex) => select_gender(itemValue)}
            >
              <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={0} label="Select Gender" />
              <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={1} label="Male" />
              <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={2} label="Female" />
            </Picker>
          </View>
          <View style={{ margin:10 }}/>
          <View style={styles.phoneFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Password"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={{ margin:10 }}/>
          {/*<View style={{width:"80%", alignSelf:"flex-start"}}>
            <Text style={{color:'grey', fontSize:15, fontFamily:regular}}>Select your Blood Group</Text>
            <Picker
            	selectedValue={blood_group}
                style={{height:50,width:'100%'}}
                onValueChange={(itemValue, itemIndex) => select_blood_group(itemValue)}
            >
            {bl_list}
            </Picker>
          </View>*/}
          <View style={{marginTop:"10%"}} />
          <TouchableOpacity  onPress={check_validation}  style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Sign Up</Text>
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
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two
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
  phoneFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two,
    fontSize:14
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

export default connect(mapStateToProps,mapDispatchToProps)(Register);
