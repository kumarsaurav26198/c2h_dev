import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput,  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, background_img, bold, clock, img_url, month_name, create_booking, time_slots, api_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const CreateAppointment = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [doctor, setDoctor] = useState(route.params.doctor_details);
  const [appointment_fee, setAppointmentFee] = useState(route.params.appointment_fee); 
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState(undefined);
  const [defaultDate, setDefaultDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  const [dates, setDateList] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); 
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    get_dates();
  },[]);

  const get_dates = async() =>{
    let dates = [];
    for(let i=0; i<7; i++){
      if(i==0){
        let today = new Date();
        dates[i] = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      }else{
        let today = new Date();
        let new_date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i);
        dates[i] = new_date.getFullYear()+'-'+(new_date.getMonth()+1)+'-'+new_date.getDate();
      }
    }
    setDateList(dates);
    setDate(dates[0]);
    get_time(dates[0]);
  }

  const get_time = async(date) =>{ 
    await axios({
      method: 'post', 
      url: api_url + time_slots,
      data:{ date:date, doctor_id:doctor.id, hospital_id:doctor.hospital_id }
    })
    .then(async response => {
      setSlots(response.data.result);
      setTime(response.data.result[0].value)
      show_slots();
    })
    .catch(error => {
    });
  }

  const onChange = async(event, selectedTime) => {
    setShow(false);
    let hours = await selectedTime.getHours(),
      minutes = await selectedTime.getMinutes(),
      seconds = await selectedTime.getSeconds();
    let time = await hours + ":" + minutes + ":" + seconds;
    setDefaultDate(selectedTime);
    setTime(time);
  };

  const change_date = (date) => {
    setDate(date);
    get_time(date);
  };

  const change_time = (time) => {
    setTime(time);
  };

  const showTimepicker = () => {
    setShow(true);
  };

  const submit_data = () =>{
    if(global.id == 0){
      navigation.navigate("CheckPhone")
    }else if(time == undefined){
      alert('Please select appointment time')
    }else if(title == ""){
      alert('Please enter the reson for appointment')
    }else if(description == ""){
      alert('Please enter the short description')
    }else if(date == undefined){
      alert('Please select appointment date')
    }else{
      let data = {
        patient_id:global.id,
        doctor_id:doctor.id,
        start_time:date+' '+time,
        date:date,
        time:time,
        title:title,
        description:description,
        total_amount:appointment_fee
      }
      payment_methods(data);
    }
  }

  const payment_methods = (data) => {
    navigation.navigate("PaymentMethods", { type : 2, amount : appointment_fee, data:data, route:create_booking, from:'appointment' });
  }

  const show_dates = () => { 
    return dates.map((data) => {
      let temp = data.split('-');
      let cur_date = temp[2];
      let month = month_name[temp[1] - 1];
      return (
        <TouchableOpacity onPress={change_date.bind(this,data)} style={ (data == date) ? styles.active_badge : styles.in_active_badge}>
          <Text style={ (data == date) ? styles.active_text : styles.in_active_text}>{cur_date}</Text>
          <View style={{ margin:1 }} />  
          <Text style={ (data == date) ? styles.active_text : styles.in_active_text}>{month}</Text>
        </TouchableOpacity>
      )
    });
  }

  const show_slots = () => { 
    return slots.map((data) => {
      return (
        <TouchableOpacity onPress={change_time.bind(this,data['value'])} style={ (data['value'] == time) ? styles.active_time_badge : styles.in_active_time_badge}>
          <Text style={ (data['value'] == time) ? styles.active_time_text : styles.in_active_time_text}>{data['key']}</Text>
        </TouchableOpacity>
      )
    });
  }

  return (
    <SafeAreaView style={styles.container}>
    	<ScrollView style={{padding:10 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 170, width: '100%', borderRadius:20 }}>
          <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={ background_img } />
          <View style={{ position:'absolute', top:0, width:'100%', flexDirection:'row' }}>
            <View style={{ width:'60%', padding:20 }}>
              <Text style={{ fontSize:20, color:colors.theme_fg_three, fontFamily:bold, marginTop:5}}>Dr.{doctor.doctor_name}</Text>
              <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:regular, marginTop:10, letterSpacing:1 }}>{doctor.specialist} - {doctor.sub_specialist}</Text>
              <View style={{ margin:15 }} />
              <View style={{ borderWidth:1, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, alignItems:'center', justifyContent:'center', borderRadius:10, width:'70%' }}>
                <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold }}>Book Now</Text>
              </View> 
            </View> 
            <View style={{ width:'40%', padding:10, alignItems:'flex-end', justifyContent:'center' }}> 
              <View style={{ height:100, width:100 }}>
                <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{ uri : img_url + doctor.profile_image}} /> 
              </View> 
            </View> 
          </View>   
        </View> 
        <View style={{ margin:10 }} />  
        <View style={{ flexDirection:'row', marginTop:10 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {show_dates()}
          </ScrollView>
        </View> 
        <View style={{ flexDirection:'row', marginTop:10 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {show_slots()}
          </ScrollView>
        </View> 
        {/*<View style={{ alignItems:'center', justifyContent:'center',}}> 
          <TouchableOpacity onPress={showTimepicker} style={styles.button1}>
            <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center', }} >
              {time == undefined ? 
              <Text style={{ color:colors.regular_grey, fontFamily:regular, fontSize:13 }}>Select time</Text>
              :
              <Text style={{ color:colors.regular_grey, fontFamily:regular, fontSize:13 }}>{time}</Text>
              }
            </View> 
            <View style={{ width:'30%', alignItems:'flex-end', justifyContent:'center', }} > 
              <View style={{ height: 30, width: 30 }}>
                <Image style={{ height: undefined, width: undefined, flex:1  }} source={ clock }/>
              </View> 
            </View> 
            </TouchableOpacity>
        </View> */}
        <View style={{ margin:10 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Booking For?</Text>
        <View style={{ margin:5 }} /> 
        <View style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            onChangeText={text => setTitle(text)}
            placeholder="May i know your health queries."
            underlineColorAndroid="transparent"
          />
        </View> 
        <View style={{ margin:5 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Short Description</Text>
        <View style={{ margin:10 }} /> 
        <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
          <TextInput
            style={styles.input}
            onChangeText={text => setDescription(text)}
            multiline={true}
            placeholder="Could you elaborate further."
            underlineColorAndroid='transparent'
          />
        </View> 
        <View style={{ margin:5 }} /> 
        <View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              mode="time"
              value={defaultDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        <View style={{ margin:10 }} /> 
        <View style={{ alignItems:'center', height:50, justifyContent:'center'}}>
          <TouchableOpacity activeOpacity={1} onPress={submit_data} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Make Payment</Text>
          </TouchableOpacity>
        </View>
        <View style={{ margin:20 }} /> 
    	</ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three
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
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two, 
    fontFamily:regular,
    borderWidth:1,
    borderColor:colors.light_grey
  },
  input: {
    width:'100%',
    height:100,
    borderColor:colors.light_grey,
    borderWidth:1,
    backgroundColor:colors.theme_bg_three,
    padding:10,
    borderRadius:10,
    fontSize:14,
    color:colors.grey, 
    fontFamily:regular
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45,
  },
  button1: {
    padding:10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor:colors.theme_fg_three,
    width:'100%',
    height:45,
    justifyContent:'flex-start',
    alignItems:'center',
    borderWidth:1,
    borderColor:colors.light_grey
  },
  in_active_badge:{ 
    borderWidth:1, 
    borderColor:colors.light_grey, 
    backgroundColor:colors.theme_fg_three, 
    padding:5, 
    width:60, 
    height:60, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  in_active_time_badge:{ 
    borderWidth:1, 
    borderColor:colors.light_grey, 
    backgroundColor:colors.theme_fg_three, 
    padding:5, 
    width:100, 
    height:40, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  active_badge:{ 
    borderWidth:1, 
    borderColor:colors.theme_bg, 
    backgroundColor:colors.theme_bg, 
    padding:5, 
    width:60, 
    height:60, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  active_time_badge:{ 
    borderWidth:1, 
    borderColor:colors.theme_bg, 
    backgroundColor:colors.theme_bg, 
    padding:5, 
    width:100, 
    height:40, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  in_active_text:{ 
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:bold 
  },
  in_active_time_text:{ 
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:bold 
  },
  active_text:{ 
    fontSize:12, 
    color:colors.theme_fg_three, 
    fontFamily:bold 
  },
  active_time_text:{ 
    fontSize:12, 
    color:colors.theme_fg_three, 
    fontFamily:bold 
  }
});

export default CreateAppointment;
