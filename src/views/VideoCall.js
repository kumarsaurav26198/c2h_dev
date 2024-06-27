import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, BackHandler, TouchableOpacity } from 'react-native';
import GettingCall from './video_call_components/GettingCall';
import Video from './video_call_components/Video';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import {
  EventOnAddStream,
  MediaStream,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import Utils from './video_call_components/Utils';
import firestore from '@react-native-firebase/firestore';
import { bold } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import database from '@react-native-firebase/database';

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

export default function VideoCall() {
  const route = useRoute();
  const navigation = useNavigation();
  const [localStream, setLocalStream] = useState(MediaStream | null);
  const [call_status, setCallStatus] = useState(0);
  const [remoteStream, setRemoteStream] = useState(MediaStream | null);
  const [gettingCall, setGettingCall] = useState(false);
  const [id, setId] = useState((route.params.id.toString())); 
  const [doctor_id, setDoctorId] = useState(route.params.doctor_id); 
  const [is_answered, setAnswered] = useState(0); 
  const pc = useRef(RTCPeerConnection);
  const connecting = useRef(false);
  
  useEffect(() => {
    const onValueChange = database().ref(`/doctors/${doctor_id}`)
    .on('value', snapshot => {
      if(snapshot.val().c_stat == 0){
        hangup();
      }
    });

    const cRef = firestore().collection('doctor_consultation').doc(id);
    const subscribe = cRef.onSnapshot((snapshot) => {
      const data = snapshot.data();

      if (pc.current && !pc.current.remoteDescription && data && data.answer) {
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if (data && data.offer && !connecting.current) {
        setGettingCall(true);
      }
    });

    const subscribeDelete = cRef.collection('callee').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change.type)
        if (change.type == 'removed') {
          hangup();
        }
      });
    });

    create();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', hangup);
    
    return () => {
      database().ref((`/doctors/${doctor_id}`).off('value', onValueChange));
      subscribe();
      subscribeDelete();
      backHandler.remove();
    };
  }, []);

  const navigate = async() => {
    navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
      })
    );
  }

  const setupWebrtc = async () => {
    pc.current = new RTCPeerConnection(configuration);

    const stream = await Utils.getStream();
    if (stream) {
      setLocalStream(stream);
      pc.current.addStream(stream);
    }

    pc.current.onaddstream = (event: EventOnAddStream) => {
      setAnswered(1);
      setRemoteStream(event.stream);
    };
  };

  const create = async () => {
    connecting.current = true;

    await setupWebrtc();

    const cRef = firestore().collection('doctor_consultation').doc(id);
    collectIceCandidates(cRef, 'caller', 'callee');

    if (pc.current) {
      const offer = await pc.current.createOffer();
      pc.current.setLocalDescription(offer);

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      cRef.set(cWithOffer);
    }
  };

  const join = async () => {
    connecting.current = true;
    setGettingCall(false);

    const cRef = firestore().collection('doctor_consultation').doc(id);
    const offer = (await cRef.get()).data()?.offer;

    if (offer) {
      // Setup Webrtc
      await setupWebrtc();

      // Exchange the ICE candidates
      // Check the parameters, Its reversed. Since the joining part is callee
      collectIceCandidates(cRef, 'callee', 'caller');

      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));

        // Create the answer for the call
        // Update the document with answer
        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);
        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        cRef.update(cWithAnswer);
      }
    }
  };

  /**
   * For disconnecting the call close the connection, release the stream
   * And delete the document for the call
   */
  const hangup = async () => {
    setCallStatus(1)
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp();
    firestoreCleanUp();
    if (pc.current) {
      pc.current.close();
    }
  };

  // Helper function

  const streamCleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };
  const firestoreCleanUp = async () => {
    const cRef = firestore().collection('doctor_consultation').doc(id);

    if (cRef) {
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      });
      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      });

      cRef.delete();
    }
  };

  const collectIceCandidates = async (
    cRef,
    localName,
    remoteName
  ) => {
    const candidateCollection = cRef.collection(localName);

    if (pc.current) {
      // On new ICE candidate add it to firestore
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          candidateCollection.add(event.candidate);
        }
      };
    }

    // Get the ICE candidate added to firestore and update the local PC
    cRef.collection(remoteName).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type == 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  // Displays the gettingCall Component
  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />;
  }

  // Displays local stream on calling
  // Displays both local and remote stream once call is connected
  if (localStream) {
    console.log(is_answered);
    return (
      <Video
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream} 
      />
    );
  }

  // Displays the call button
  return (
    <View style={styles.container}>
      {call_status == 0 ? 
        <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two }}>Processing</Text>
      :
        <View style={{ alignItems:'center', justifyContent:'center'}}>
          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two }}>Your call is disconnected</Text>
          <View style={{ margin:10 }} />
          <TouchableOpacity onPress={navigate} activeOpacity={1} style={{ borderRadius:10, height:40, width:'90%', marginLeft:'5%', backgroundColor:colors.theme_bg, padding:10, alignItems:'center', justifyContent:'center'}}>
              <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_three }}>Back</Text>
          </TouchableOpacity>
        </View>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
