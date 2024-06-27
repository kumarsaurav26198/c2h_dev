import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MediaStream, RTCView } from 'react-native-webrtc';
import Button from './Button';
import InCallManager from 'react-native-incall-manager';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as colors from '../../assets/css/Colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
  hangup: () => void;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
}

function ButtonContainer(props: Props) {
  return (
    <View style={styles.bContainer}>
      <Button iconName="phone" backgroundColor="red" onPress={props.hangup} />
    </View>
  );
}

export default function Video(props: Props) {
  // On call we will just display the local stream
  if (props.localStream && !props.remoteStream) {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          mirror={true}
          style={styles.video}
        />
        <ButtonContainer hangup={props.hangup} />
      </View>
    );
  }
  // Once the call is connected we will display
  // local Stream on top of remote stream
  if (props.localStream && props.remoteStream) {
    InCallManager.start('audio')
    InCallManager.setForceSpeakerphoneOn(true);
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.remoteStream.toURL()}
          objectFit={'cover'}
          mirror={true}
          style={styles.video}
        />
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.videoLocal}
        />
        <ButtonContainer hangup={props.hangup} />
      </View>
    );
  }
  return <ButtonContainer hangup={props.hangup} />;
}
const styles = StyleSheet.create({
  bContainer: {
    flexDirection: 'row',
    bottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoLocal: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 0,
    left: 20,
    elevation: 10,
  },
});
