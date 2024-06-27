import React from 'react';
import { View, Text } from 'react-native';
import { bold } from '../config/Constants';
import * as colors from '../assets/css/Colors';

const MyLabTests = () =>{

	return(
		<View style={{ padding:10, alignItems:'center' }} >
		  <View style={{ margin:40 }} />
		  <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg_two }}> Under Processing </Text>
		</View>
	)
}

export default MyLabTests;