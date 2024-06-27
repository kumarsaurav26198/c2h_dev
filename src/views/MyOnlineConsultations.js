import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { bold, regular, consultation_list, api_url, img_url, start_call } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader  from '../components/Loader';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon, { Icons } from '../components/Icons';
import Moment from 'moment';

const MyOnlineConsultations = () =>{
	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);
	const [consult_list, setConsultList] = useState([]);
	const [dt, setDt] = useState(new Date().toTimeString().split(' ')[0]);

	var d = new Date(); // get current date
	d.setHours(d.getHours(),d.getMinutes()+30,0,0);
	console.log(d.toLocaleTimeString())

	useEffect( () => {
		const unsubscribe = navigation.addListener('focus', async () => {
		  get_consultation_list();
		});
		let secTimer = setInterval( () => {
			setDt(new Date().toTimeString().split(' ')[0])
		  },1000)

		return unsubscribe;
		return () => clearInterval(secTimer);
	},[]); 

	const get_consultation_list = async () => {
		setLoading(true);
	  await axios({
		method: "post",
		url: api_url + consultation_list,
		data: { customer_id:global.id }
	  })
	  .then(async (response) => {
			setLoading(false);
			setConsultList(response.data.result);
			console.log(response.data.result)
	  })
	  .catch(async(error) => {
		  await setLoading(false);
		alert('Sorry, something went wrong!')
	  });
	}

	const move_rating = (data) =>{
		navigation.navigate("ConsultationRating",{ data : data });
	}

	const view_prescription = (data) =>{
		navigation.navigate("ViewPrescription", {data:data});
	}

	const check_time = (id, doctor_id, time) =>{
		if(time => dt){
			call_start(id, doctor_id)
		}else{
			alert('Wait for your turn')
		}
	}

	const call_start = async (id, doctor_id) => {
		setLoading(true);
	  await axios({
		method: "post",
		url: api_url + start_call,
		data: { id:id }
	  })
	  .then(async (response) => {
		if(response.data.status == 1){
			move_to_room(id, doctor_id);
		}else{
			alert(response.data.message);
		}
	  })
	  .catch(async(error) => {
		setLoading(false);
		alert('Sorry, something went wrong!')
	  });
	}

	const move_to_room = (id,doctor_id) =>{
	navigation.navigate('VideoCall',{ id : id, doctor_id:doctor_id })
	}

	const chat = (id) =>{
		navigation.navigate('DoctorChat',{ id : id })
	}

	const renderItem = ({ item }) => (
		<CardView
			cardElevation={5}
			cardMaxElevation={5}
			style={{ margin:5, marginLeft:10, marginRight:10 }}
			cornerRadius={10}>
			<View style={{ padding:10, flexDirection:'row', width:'100%'}}>
				<View style={{ width:'20%',justifyContent:'center', alignItems:'center' }}>
					<Image style={{ height: 50, width: 50, borderRadius:10 }} source={{uri: img_url + item.profile_image}} />
				</View>  
				<View style={{ margin:5 }}/>
				<View style={{ width:'65%'}}>
					<Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold  }}>Dr.{item.doctor_name} #{item.id}</Text>
					<View style={{ margin:3 }} />
					{item.status == 4 ?
					<Text style={{ fontSize:12, color:colors.success, fontFamily:bold  }}>{item.status_name}</Text>
					:
					<Text style={{ fontSize:12, color:colors.error, fontFamily:bold  }}>{item.status_name}</Text>
					}
					<View style={{margin:5}}/>
					{item.btn_status == 1 && item.status != 3 && item.status != 4 && 
					<TouchableOpacity onPress={check_time.bind(this, item.id, item.doctor_id, item.time)} style={{ alignItems:"flex-start", justifyContent:'center', flexDirection:'row' }}>
						<Icon type={Icons.Ionicons} name="call" color={colors.error} style={{ fontSize:15 }} />
						<View style={{ margin:2 }}/>
						<Text>Call Doctor</Text>
					</TouchableOpacity>
					}
				</View>
				<View style={{ width:'15%'}}>
					<Text style={{ fontSize:11, color:colors.grey, fontFamily:regular  }}>{global.currency}{item.total}</Text>
				</View>
			</View>
			<View style={{ flexDirection:'row', with:'100%', padding:10,}}>
				<View style={{ width:'50%', justifyContent:'flex-start', alignItems:'flex-start'}}>
					{item.status == 4 &&
						<TouchableOpacity onPress={view_prescription.bind(this, item)} style={{borderRadius:20, borderColor:colors.error_background, borderWidth:1, justifyContent:'center', alignItems:'center'}}>
							<Text style={{fontSize:12, color:colors.warning, fontFamily:bold, textAlign:'center', margin:5  }}>Prescription Uploaded</Text>
						</TouchableOpacity>
					}
				</View>
				<View style={{ width:'25%', justifyContent:'flex-end', alignItems:'flex-end'}}>
					{item.status == 4 &&
						<TouchableOpacity onPress={chat.bind(this,item.id)} style={{ borderWidth:1, borderRadius:5, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
							<Text style={{ fontSize:11, color:colors.theme_fg_three, fontFamily:bold, padding:5,  }}>Chat</Text>
						</TouchableOpacity>
					}
				</View>
				<View style={{ width:'25%', justifyContent:'flex-end', alignItems:'flex-end'}}>
					{item.rating == 0 && item.status == 4 ? 
						<TouchableOpacity onPress={move_rating.bind(this,item)} style={{ borderWidth:1, borderRadius:5, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
							<Text style={{ fontSize:11, color:colors.theme_fg_three, fontFamily:bold, padding:5,  }}>Add Rating</Text>
						</TouchableOpacity>
					:
						<View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
							<Icon type={Icons.Ionicons} name="star" color={colors.warning} style={{ fontSize:15 }} />
							<View style={{ margin:1}} />
							<Text style={{ fontSize:15, color:colors.grey, fontFamily:bold  }}>{item.rating} rating</Text>
						</View>
					}
				</View>
			</View>
		</CardView>
	);

	return(
		<SafeAreaView style={styles.container}>
			<View style={{ margin:5 }} />
    		<Loader visible={loading} />
			{consult_list.length > 0 ?
			<FlatList
				data={consult_list}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>
			:
			<View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
				<Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no data found</Text>
			</View>
			}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: 'flex-start',
	  backgroundColor:colors.light_blue,
	}
  });
  
export default MyOnlineConsultations;
