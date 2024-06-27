import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import { add_reminder_icon, today_reminder_icon, my_reminder_icon, bold, regular } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';

const PillsReminder = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.container}>
    	<ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={{flexDirection:'row', marginLeft:20, marginRight:20, marginTop:15, marginBottom:15}}>
                <View style={{ width:'20%'}}>
                    <Image source={my_reminder_icon} style={{ height:40, width:40}} />
                </View>
                <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>View Reminders</Text>
                    <View style={{ margin:2 }} />
                    <Text style={{ fontSize:12, fontFamily:regular, color:colors.grey}}>This is short description</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', marginLeft:20, marginRight:20, marginTop:15, marginBottom:15}}>
                <View style={{ width:'20%'}}>
                    <Image source={add_reminder_icon} style={{ height:40, width:40}} />
                </View>
                <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Add Reminder</Text>
                    <View style={{ margin:2 }} />
                    <Text style={{ fontSize:12, fontFamily:regular, color:colors.grey}}>This is short description</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', marginLeft:20, marginRight:20, marginTop:15, marginBottom:15}}>
                <View style={{ width:'20%'}}>
                    <Image source={today_reminder_icon} style={{ height:40, width:40}} />
                </View>
                <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Today Reminders</Text>
                    <View style={{ margin:2 }} />
                    <Text style={{ fontSize:12, fontFamily:regular, color:colors.grey}}>This is short description</Text>
                </View>
            </TouchableOpacity>
	    </ScrollView>
    </SafeAreaView>  
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  description: {
    padding:10
  }
});

export default PillsReminder;
