import React, { useState, useEffect } from 'react';
import { StyleSheet,  View, SafeAreaView, Text,  ScrollView, TouchableOpacity, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import {  api_url, regular, bold, get_booking_requests, img_url } from '../config/Constants';
import { useNavigation,  useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview';
import axios from 'axios';
import Moment from 'moment';
import Loader from '../components/Loader';
import Icon, { Icons } from '../components/Icons';

const MyAppointments = () => {
  
  const navigation = useNavigation();
  const route = useRoute();
  const [active_state, setActiveState] = useState(1);
  const [is_error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [cancelled, setCancelled] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      my_booking_requests();
    });
    return unsubscribe;
  },[]);

  const appointment_details = (data) =>{
    navigation.navigate("AppointmentDetails", { data : data });
  }

  const my_booking_requests = async() =>{ 
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_booking_requests,
      data:{ customer_id : global.id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setUpcoming(response.data.result['upcoming']);
        setCompleted(response.data.result['completed']);
        setCancelled(response.data.result['cancelled']);
      }else{
        setError(1);
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const move_rating = (data) =>{
		navigation.navigate("AppointmentRating",{ data : data });
	}

  const change_active_state = (val) =>{
    setActiveState(val);
  }

  const show_upcoming = () => { 
    if(upcoming.length == 0){
      return(
        <View style={{ alignItems:'center', justifyContent:'center', marginTop:'30%'}}>
          <Text style={{ fontFamily:bold, color:colors.grey, fontSize:14}}>Sorry no data found</Text>
        </View>
      )
    }else{
      return upcoming.map((data,i) => {
        return (
          <TouchableOpacity onPress={appointment_details.bind(this,data)} style={{ flexDirection:'row', borderWidth:0.5, borderRadius:10, borderColor:colors.light_grey, padding:10, width:'94%', marginLeft:'3%', marginRight:'3%', backgroundColor:colors.theme_bg_three}}>
          <View style={{ width:'20%', alignItems:'center', justifyContent:'center', backgroundColor:colors.light_blue, padding:5, borderRadius:10}}>
            <Text style={{ fontFamily:bold, color:colors.grey, fontSize:20}}>{Moment(data.start_time).format('DD')}</Text>
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:14}}>{Moment(data.start_time).format('MMM')}</Text>
          </View>
          <View style={{ width:'50%', alignItems:'flex-start', paddingLeft:10, justifyContent:'flex-start'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>{data.hospital_name}</Text>
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:14}}>Dr.{data.doctor_name}</Text>
            <View style={{ margin:5 }} />
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold}} >{data.status_name}</Text>
          </View>
          <View style={{ width:'30%', alignItems:'center', paddingLeft:10, justifyContent:'flex-start'}}>
            <View style={{ width:40, height:40 }}>
              <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:20 }} source={{ uri : img_url + data.hospital_logo }}/>
            </View>
            <View style={{ margin:4 }} />
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Icon style={{ fontSize:18 }} type={Icons.Feather} name="clock" color={colors.grey} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:16, color:colors.grey, fontFamily:bold}} >{Moment(data.start_time).format('hh:mm')}</Text>
            </View>
          </View>
        </TouchableOpacity>
        )
      });
    }
  }

  const show_completed = () => { 
    if(completed.length == 0){
      return(
        <View style={{ alignItems:'center', justifyContent:'center', marginTop:'30%'}}>
          <Text style={{ fontFamily:bold, color:colors.grey, fontSize:14}}>Sorry no data found</Text>
        </View>
      )
    }else{
      return completed.map((data,i) => {
        return (
          <TouchableOpacity onPress={appointment_details.bind(this,data)} style={{ flexDirection:'row', borderWidth:0.5, borderRadius:10, borderColor:colors.light_grey, padding:10, width:'94%', marginLeft:'3%', marginRight:'3%', backgroundColor:colors.theme_bg_three}}>
          <View style={{ width:'20%', alignItems:'center', justifyContent:'center', backgroundColor:colors.light_blue, padding:5, borderRadius:10}}>
            <Text style={{ fontFamily:bold, color:colors.grey, fontSize:20}}>{Moment(data.start_time).format('DD')}</Text>
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:14}}>{Moment(data.start_time).format('MMM')}</Text>
          </View>
          <View style={{ width:'50%', alignItems:'flex-start', paddingLeft:10, justifyContent:'flex-start'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>{data.hospital_name}</Text>
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:14}}>Dr.{data.doctor_name}</Text>
            <View style={{ margin:5 }} />
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold}} >{data.status_name}</Text>
          </View>
          <View style={{ width:'30%', alignItems:'center', paddingLeft:10, justifyContent:'flex-start'}}>
            <View style={{ width:40, height:40 }}>
              <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:20 }} source={{ uri : img_url + data.hospital_logo }}/>
            </View>
            <View style={{ margin:4 }} />
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Icon style={{ fontSize:18 }} type={Icons.Feather} name="clock" color={colors.grey} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:16, color:colors.grey, fontFamily:bold}} >{Moment(data.start_time).format('hh:mm')}</Text>
            </View>
          </View>
        </TouchableOpacity>
        )
      });
    }
  }

  const show_cancelled = () => { 
    if(cancelled.length == 0){
      return(
        <View style={{ alignItems:'center', justifyContent:'center', marginTop:'30%'}}>
          <Text style={{ fontFamily:bold, color:colors.grey, fontSize:14}}>Sorry no data found</Text>
        </View>
      )
    }else{
      return cancelled.map((data,i) => {
        return (
          <TouchableOpacity onPress={appointment_details.bind(this,data)} style={{ flexDirection:'row', borderWidth:0.5, borderRadius:10, borderColor:colors.light_grey, padding:10, width:'94%', marginLeft:'3%', marginRight:'3%', backgroundColor:colors.theme_bg_three}}>
          <View style={{ width:'20%', alignItems:'center', justifyContent:'center', backgroundColor:colors.light_blue, padding:5, borderRadius:10}}>
            <Text style={{ fontFamily:bold, color:colors.grey, fontSize:20}}>{Moment(data.start_time).format('DD')}</Text>
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:14}}>{Moment(data.start_time).format('MMM')}</Text>
          </View>
          <View style={{ width:'50%', alignItems:'flex-start', paddingLeft:10, justifyContent:'flex-start'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>{data.hospital_name}</Text>
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:14}}>Dr.{data.doctor_name}</Text>
            <View style={{ margin:5 }} />
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold}} >{data.status_name}</Text>
            
          </View>
          <View style={{ width:'30%', alignItems:'center', paddingLeft:10, justifyContent:'flex-start'}}>
            <View style={{ width:40, height:40 }}>
              <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:20 }} source={{ uri : img_url + data.hospital_logo }}/>
            </View>
            <View style={{ margin:4 }} />
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Icon style={{ fontSize:18 }} type={Icons.Feather} name="clock" color={colors.grey} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:16, color:colors.grey, fontFamily:bold}} >{Moment(data.start_time).format('hh:mm')}</Text>
            </View>
          </View>
        </TouchableOpacity>
        )
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <View style={{ padding:10 }} />
      <View style={{ flexDirection:'row', padding:10}}>
				<TouchableOpacity onPress={change_active_state.bind(this,1)} style={[active_state == 1 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
					<Text style={[active_state == 1 ? styles.segment_active_fg : styles.segment_inactive_fg]}>Upcoming</Text>
				</TouchableOpacity>
        <TouchableOpacity onPress={change_active_state.bind(this,2)} style={[active_state == 2 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
					<Text style={[active_state == 2 ? styles.segment_active_fg : styles.segment_inactive_fg]}>Completed</Text>
				</TouchableOpacity>
        <TouchableOpacity onPress={change_active_state.bind(this,3)} style={[active_state == 3 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
					<Text style={[active_state == 3 ? styles.segment_active_fg : styles.segment_inactive_fg]}>Cancelled</Text>
				</TouchableOpacity>
			</View>
      <View style={{ margin:10 }} />
      
      <ScrollView  style={{ padding:5 }} showsVerticalScrollIndicator={false}>
        {active_state == 1 &&
          show_upcoming()
        }
        {active_state == 2 &&
          show_completed()
        }
        {active_state == 3 &&
          show_cancelled()
        }
      </ScrollView>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  segment_active_bg:{ width:'32%', alignItems:'center', justifyContent:'center', backgroundColor:colors.theme_bg, padding:10, borderRadius:30},
  segment_inactive_bg:{ width:'32%', alignItems:'center', justifyContent:'center', padding:10},
  segment_active_fg:{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16 },
  segment_inactive_fg:{ fontFamily:bold, color:colors.grey, fontSize:16 }

});

export default MyAppointments;