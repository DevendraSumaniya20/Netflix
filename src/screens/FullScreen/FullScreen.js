import React, {useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import CustomVideo from '../../components/CustomVideo';
import Color from '../../constants/Color';

const FullScreen = () => {
  const [isVideoPlaying, setVideoPlaying] = useState(true);
  const [fullscreen, setFullscreen] = useState(true);

  useEffect(() => {
    Orientation.lockToLandscape();
    StatusBar.setHidden(true);
    return () => {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <View style={styles.container}>
      {isVideoPlaying && (
        <CustomVideo
          uri={require('../../assets/video/videoplayback.mp4')}
          fullscreen={fullscreen}
        />
      )}
    </View>
  );
};

export default FullScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.BLACK,
  },
});
