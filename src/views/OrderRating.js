import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, api_url, order_rating } from '../config/Constants';
import { AirbnbRating } from 'react-native-ratings';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
const OrderRating = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const [comments, setComments] = useState('');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(route.params.data);

    const handleBackButtonClick= () => {
        navigation.goBack()
    }   

    const give_rating = async () => {
        await setLoading(true);
        await axios({
            method: "post",
            url: api_url + order_rating,
            data: { id:data.id, rating:count, comments:comments }
        })
        .then(async (response) => {
            await setLoading(false);
            await handleBackButtonClick();
        })
        .catch(async(error) => {
            await setLoading(false);
            alert('Sorry, something went wrong!')
        });
    }

    const onStarRatingPress = (rating) => {
        setCount(rating)
        console.log(rating)
    }

    const show_products = (items) => {
        const list = JSON.parse(items);
        return list.map((product) => {
            return (
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular, margin:3}}>{product.qty} x {product.product_name}</Text>
            )
        })
    }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection:'row', margin:10}}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="close-circle-outline" color={colors.grey} style={{ fontSize:30 }} />
        </TouchableOpacity>
        <View style={{ width:'80%', justifyContent:'center', alignItems:'center'}}>
          <Text style={{ fontFamily:bold, fontSize:18, color:colors.grey}}>Share your experience</Text>
        </View>
      </View>
      <View style={{ margin:20}} />
      <View style={{ alignItems:'center'}}>
        <Text style={{ color:colors.grey, fontFamily:bold, fontSize:14 }}>{data.store_name}</Text>
        <View style={{ margin:'2%'}} />
        {show_products(data.items)}
      </View>
      <View style={{ margin:'10%' }} />
      <View style={{alignItems:'center' }}>
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "OK", "Good", "Very Good" ]}
          defaultRating={5}
          size={30}
          onFinishRating={onStarRatingPress}
        />
      </View>
      <View style={{ margin:'10%' }} />
      <View style={{ alignItems:'center', justifyContent:'center'}}>
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14 }}>Do you have any comments</Text>
        <View style={{ margin:10 }} />
        <TextInput
          style={styles.input}
          onChangeText={text=> setComments(text)}
          multiline={true}
          placeholder="Enter your comment"
          underlineColorAndroid='transparent'
        />
        <View style={{ margin:10 }} />
        <TouchableOpacity onPress={give_rating.bind(this)} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:regular}}>Rate this order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>  
  )
 }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
    justifyContent:'flex-start',
    padding:10
  },
   button: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width: '80%',
    height:40
  },
  input: {
    width:'80%',
    height:100,
    borderColor:colors.light_grey,
    borderWidth:1,
    backgroundColor:colors.light_grey,
    borderRadius:10,
    padding:10
  },
});

export default OrderRating;
