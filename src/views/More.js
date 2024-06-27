import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, img_url, login_entry_img, wallet_imge, customer_get_profile } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux'; 
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';

const More = (props) => {

  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wallet_amount,setWalletAmount] = useState(0);

  const next = async(name) => {
    if(name == "Login to see your other features" && global.id == 0){
      navigation.navigate("CheckPhone")
    }if(name == 'Notifications'){
      navigation.navigate("Notifications")
    }else if(name == 'Address Book'){
      navigation.navigate("AddressList", { from : 'more'} )
    }else if(name == 'FAQ Categories'){
      navigation.navigate("FaqCategories")
    }else if(name == 'Privacy Policies'){
      navigation.navigate("PrivacyPolicies")
    }else if(name == 'Logout'){
      showDialog();
    }
  }

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleLogout = async() => {
    setVisible(false);
    navigate();
  };

  const navigate = async() =>{
    await AsyncStorage.clear();
    global.online_status=0
    navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [{ name: "Splash" }],
      })
    );
  }
 
  const DATA = [
    {
      id:1,
      title: 'Notifications',
      icon:'notifications-outline'
    },
    {
      id:3,
      title: 'Address Book',
      icon:'location-outline'
    },
    {
      id:4,
     title: 'FAQ Categories',
      icon:'help-outline'
    },
    {
      id:5,
      title: 'Privacy Policies',
      icon:'finger-print-outline'
    },
    {
      id:6,
      title: 'Logout',
      icon:'log-out-outline'
    },
    
  ];

  const profile = () => {
    navigation.navigate("Profile")
  }

  const open = () => {
    setShowModal(false)
      setTimeout(() => {
        Alert.alert('Alert', 'Works fine');
      }, 510);
  }

  const Login_DATA = [
    {
      id:1,
      title: "Login to see your other features",
      Icon:'walk-outline'
    }
  ]
  
  const navigate_login = () =>{
    navigation.navigate("CheckPhone")
  }

  const view_profile = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_get_profile,
      data:{ id: global.id }
    })
    .then(async response => {
      setLoading(false);
      setWalletAmount(response.data.result.wallet); 
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const add_wallet = async(number) =>{
    let phoneNumber = '';
    if (Platform.OS === 'android'){ 
      phoneNumber = `tel:${number}`; 
    }else{
      phoneNumber = `telprompt:${number}`; 
    }
    await Linking.openURL(phoneNumber);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={next.bind(this,item.title)}>
      <Dialog.Container contentStyle={{backgroundColor:colors.theme_bg_three}} visible={visible}>
        <Dialog.Title style={{fontFamily: bold, color:colors.theme_fg_two, fontSize:18}}>Confirm Logout</Dialog.Title>
        <Dialog.Description style={{fontFamily: regular, color:colors.theme_fg_two, fontSize:16}}>
          Do you want to logout?
        </Dialog.Description>
        <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="Yes" onPress={handleLogout} />
        <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="No" onPress={handleCancel} />
      </Dialog.Container>
      <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
        <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Ionicons} name={item.icon} color={colors.regular_grey} style={{ fontSize:20 }} />
        </View>  
        <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.title}</Text>
        </View>
        <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
        </View>  
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {global.id == 0 ?
        <TouchableOpacity onPress={navigate_login} style={styles.null_container}>
          <Image source={login_entry_img} style={{ height:'40%', width:'60%'}}/>
          <View style={{margin:10}}/>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_bg_two}}>Click to Login</Text>
        </TouchableOpacity>
        :
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
            <View style={{ margin:5}} />
            <View style={styles.header}>
              <View style={{ width:'100%',justifyContent:'center', alignItems:'flex-start' }}>
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Settings</Text>
              </View>
            </View>
            <View style={{ margin:10 }} />
            <View style={{ flexDirection:"row", width:'100%', alignItems:'center', justifyContent:'center' }}>
              <TouchableOpacity activeOpacity={1} onPress={profile} style={{ width:'50%' }}>
                <CardView
                  cardElevation={5}
                  style={{ paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5, backgroundColor:colors.theme_bg_three }}
                  cardMaxElevation={5}
                  cornerRadius={10}>
                  <View style={{ flexDirection:'row', paddingTop:15, paddingBottom:15,}}>
                    <View style={{ width:'35%',justifyContent:'center', alignItems:'flex-start' }}>
                      <Image style={{ height: 40, width: 40, borderRadius:50 }} source={{uri: img_url + props.profile_picture}} />
                    </View>  
                    <View style={{ width:'65%', justifyContent:'center', alignItems:'flex-start'}}>
                      <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two}}>{global.customer_name}</Text>
                    <View style={{ margin:2 }} />
                      <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>Edit Profile</Text>   
                    </View>
                  </View>
                </CardView>
              </TouchableOpacity>
              <View style={{ width:'50%' }}>
                <CardView
                  cardElevation={5}
                  style={{ paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5, backgroundColor:colors.theme_bg_three }}
                  cardMaxElevation={5}
                  cornerRadius={10}>
                  <TouchableOpacity onPress={add_wallet.bind(this, global.admin_phone_number)} activeOpacity={1} style={{ flexDirection:'row', paddingTop:15, paddingBottom:15,}}>
                    <View style={{ width:'35%',justifyContent:'center', alignItems:'center' }}>
                      <Image style={{ height: 35, width: 35 }} source={wallet_imge} />
                    </View>  
                    <View style={{ width:'65%', justifyContent:'center', alignItems:'flex-start'}}>
                      <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two}}>{global.currency}{wallet_amount}</Text>
                      <View style={{ margin:2 }} />
                      <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>Add Wallet</Text>   
                    </View>
                  </TouchableOpacity>
                </CardView>
              </View>
            </View>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />    
          </ScrollView>
        </SafeAreaView>  
      }
     </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:colors.theme_bg_three,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
  },
  null_container: {
    height:'100%',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:colors.theme_bg_three,

  },
});
function mapStateToProps(state){
  return{
    profile_picture : state.current_location.profile_picture,

  };
}

export default connect(mapStateToProps,null)(More);
