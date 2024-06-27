import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity, ScrollView, SafeAreaView, View } from 'react-native';
import { api_url, get_prescription, bold } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader from '../components/Loader'; 
import axios from 'axios';
import { Badge } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updatePrescriptionDetails, updatePrescriptionId  } from '../actions/PrescriptionOrderActions';
import { connect } from 'react-redux'; 

const ViewPrescription = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false); 
  const [booking, setBooking] = useState(route.params.data); 
  const [data, setData] = useState([]); 

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      show_prescriptions();
    });
    return unsubscribe;
  },[]); 

  const make_order = () => {
    navigation.navigate('Pharmacies');
  }

  const show_prescriptions = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_prescription,
      data:{ booking_id:booking.id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        props.updatePrescriptionDetails(response.data.result.items);
        props.updatePrescriptionId(response.data.result.prescription_id);
        setData(response.data.result.items)
      }else{
        alert("Please wait doctor will upload your prescription.")
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry, something went wrong');
    });
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{ margin:10}}/>
      <ScrollView>
        <View>
          <FlatList
            data={data}
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
      {data.length != 0 &&
        <View>
          <TouchableOpacity activeOpacity={1} onPress={make_order} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Make Prescription Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Download Prescription</Text>
          </TouchableOpacity>
        </View>
      }
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

function mapStateToProps(state){
	return{
		prescription_details : state.prescription_order.prescription_details,
    prescription_id : state.prescription_order.prescription_id, 
  
	};
  }
  
  const mapDispatchToProps = (dispatch) => ({
	updatePrescriptionDetails: (data) => dispatch(updatePrescriptionDetails(data)),
  updatePrescriptionId: (data) => dispatch(updatePrescriptionId(data)), 
  });
  
export default connect(mapStateToProps,mapDispatchToProps)(ViewPrescription);

const styles = StyleSheet.create({
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
