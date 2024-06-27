import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity} from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, medicine_image } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';
import StarRating from 'react-native-star-rating';

const PharmProductDetails = () => {

  const navigation = useNavigation();
 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding:10}} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={{ width:'100%' , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_three} style={{ fontSize:30 }} />
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <View style={{ alignItems:'center', justifyContent:'center'}} >
          <View style={{ height:230, width:230}} >
            <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={medicine_image} />
          </View>
        </View>
        <View style={{ margin:10 }}/>
        <View style={{borderWidth:0.5, borderColor:colors.theme_fg_three, width:'100%', backgroundColor:colors.theme_fg_three, borderRadius:30, padding:30}} >
          <View style={{ flexDirection:'row' }}>
            <View style={{ width:'90%' , justifyContent:'center', alignItems:'flex-start' }}>
              <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20}}>Multi Vitamins</Text>
              <View style={{ margin:5 }}/>
              <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12}}>90 Pills</Text>
              <View style={{ margin:5 }}/>
              <View style={{ width:'50%' }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  starSize={20}
                  fullStarColor={colors.yellow}
                  emptyStarColor={colors.grey}
                  rating={4}
                  selectedStar={(rating) => onStarRatingPress(rating)}
                />
              </View>
            </View>
            <View style={{ width:'10%' , justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:10, borderColor:colors.light_orange, padding:5, backgroundColor:colors.light_orange }}>
              <TouchableOpacity>                   
                <Icon type={Icons.Ionicons} name="remove-outline" style={{ fontSize:20, color:colors.theme_fg_three }} />  
              </TouchableOpacity>    
              <View style={{ margin:2 }}/>   
              <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_three,}}>3</Text>   
              <View style={{ margin:2 }}/> 
              <TouchableOpacity> 
                <Icon type={Icons.MaterialIcons} name="add" style={{ fontSize:20, color:colors.theme_fg_three }} />
              </TouchableOpacity> 
            </View>
          </View>
          <View style={{ margin:10 }}/>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>Product Detail</Text>
          <View style={{ margin:5 }}/>
          <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12}}>It is used to provide relief from the symptoms of cold and flu. It helps treat headache, nasal congestion, sore throat, body pain, and lethargy (commonly associated with fever). It is also known to provide strong and safe action against a wide range of symptoms commonly seen in flu or seasonal illness.</Text>
          <View style={{ margin:5 }}/>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18}}>₹250</Text>
          <View style={{ margin:10 }}/>
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={{ width:'80%', alignItems:'center', justifyContent:'center', backgroundColor:colors.light_yellow, borderRadius:15, padding:5, height:40}}>
                <Icon type={Icons.Ionicons} name="ios-cart-sharp" color={colors.theme_fg_three} style={{ fontSize:20 }} />
              </View>
            </View>
            <View style={{ width:'80%', alignItems:'flex-end', justifyContent:'center'}}>
              <TouchableOpacity style={{ width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:colors.regular_blue, borderRadius:15, padding:5, height:40}}>
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Add to cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ margin:10 }}/>
      </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.yellow,
  },
   
});

export default PharmProductDetails;
