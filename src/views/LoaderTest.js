import React, { useState, useEffect } from 'react'
import { Text, StyleSheet  } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
export default function LoaderTest() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setVisible(true)
    }, 2000);
  }, []);

  return (
    <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.75)"
        source={require('.././assets/json/loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text>Please wait...</Text>
      </AnimatedLoader>
  )
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200
  }
});
