import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import { success_reminder_icon, failed_reminder_icon, bold, regular, confirm_remainder } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview';
import LottieView from 'lottie-react-native';

const ConfirmReminder = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ margin:10 }} />
            <CardView
                style={{ margin:10, padding:10 }}
                cardElevation={5}
                cardMaxElevation={5}
                cornerRadius={10}>
                    <View style={{ padding:10, width:'100%', justifyContent:'center'}}>
                        <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Medicine Name</Text>
                        <View style={{ margin:2}} />
                        <Text style={{ fontFamily:bold, color:colors.grey, fontSize:12}}>1 Dose</Text>
                    </View>
                    <View style={{ padding:10, width:'100%', justifyContent:'center'}}>
                        <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Medicine Name</Text>
                        <View style={{ margin:2}} />
                        <Text style={{ fontFamily:bold, color:colors.grey, fontSize:12}}>1 Dose</Text>
                    </View>
                    <View style={{ padding:10, width:'100%', justifyContent:'center'}}>
                        <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Medicine Name</Text>
                        <View style={{ margin:2}} />
                        <Text style={{ fontFamily:bold, color:colors.grey, fontSize:12}}>1 Dose</Text>
                    </View>
            </CardView>
            <View style={{ margin:30 }} />
        </ScrollView>
        <TouchableOpacity style={{ height:40, position:'absolute', bottom:10, width:'100%', backgroundColor:colors.success, padding:10, alignItems:'center', justifyContent:'center', width:'90%', marginLeft:'5%', borderRadius:10 }}>
                <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16}}>Done</Text>
        </TouchableOpacity>
    </SafeAreaView>  
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  }
});

export default ConfirmReminder;
