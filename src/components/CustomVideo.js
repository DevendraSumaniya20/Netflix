import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Color from '../constants/Color';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import ImagePath from '../constants/ImagePath';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../constants/navigationString';

const CustomVideo = ({uri, isVisible, isPaused}) => {
  const [buffering, setBuffering] = useState(false);
  const [paused, setPaused] = useState(isPaused);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [locked, setLocked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [orientation, setOrientation] = useState('PORTRAIT');
  const [showBackArrow, setShowBackArrow] = useState(false);

  const navigation = useNavigation();
  const videoRef = useRef(null);
  let controlTimeout;

  useEffect(() => {
    setPaused(isPaused);
  }, [isPaused]);

  useEffect(() => {
    const orientationDidChange = newOrientation => {
      setOrientation(newOrientation);
    };

    Orientation.addOrientationListener(orientationDidChange);

    return () => {
      Orientation.removeOrientationListener(orientationDidChange);
    };
  }, []);

  const onBuffer = isBuffering => {
    setBuffering(isBuffering);
  };

  const handlePlayPause = () => {
    setPaused(!paused);
    setShowControls(true);
    setControlTimeout();
  };

  const handleSeek = seekTime => {
    videoRef.current.seek(seekTime);
    setShowControls(true);
    setControlTimeout();
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      Orientation.lockToLandscape();
      StatusBar.setHidden(true);
      setFullscreen(true);
      setShowBackArrow(true);
      navigation.navigate(navigationString.FULLSCREEN);
    } else {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
      setFullscreen(false);
      setShowBackArrow(false);
      navigation.goBack();
    }
  };

  const changePlaybackSpeed = speed => {
    setPlaybackSpeed(speed);
    Alert.alert('Playback Speed', `Playback speed changed to ${speed}`);
  };

  const handleBackward = () => {
    const newTime = currentTime - 10;
    handleSeek(newTime < 0 ? 0 : newTime);
    setShowControls(true);
    setControlTimeout();
  };

  const handleForward = () => {
    const newTime = currentTime + 10;
    handleSeek(newTime > duration ? duration : newTime);
    setShowControls(true);
    setControlTimeout();
  };

  const handleLock = () => {
    setLocked(!locked);
    setShowControls(true);
    setControlTimeout();
  };

  const toggleVolume = () => {
    setVolume(volume === 1.0 ? 0.0 : 1.0);
    const message = volume === 1.0 ? 'Volume muted' : 'Volume unmuted';
    Alert.alert('Volume', message);
    setShowControls(true);
    setControlTimeout();
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    if (!showControls) {
      setControlTimeout();
    }
  };

  const setControlTimeout = () => {
    clearTimeout(controlTimeout);
    controlTimeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <TouchableWithoutFeedback onPress={toggleControls}>
      <View
        style={[styles.container, fullscreen && styles.fullscreenContainer]}>
        {showBackArrow && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image source={ImagePath.BACKARROW} style={styles.backIcon} />
          </TouchableOpacity>
        )}

        <Video
          source={uri}
          ref={videoRef}
          onBuffer={onBuffer}
          onProgress={onProgress}
          paused={paused}
          volume={volume}
          rate={playbackSpeed}
          style={[
            styles.backgroundVideo,
            fullscreen ? styles.fullscreenVideo : styles.portraitVideo,
          ]}
          resizeMode={fullscreen ? 'cover' : 'contain'}
          onLoad={data => setDuration(data.duration)}
          repeat={false}
        />

        {buffering && (
          <View style={styles.bufferingOverlay}>
            <Text style={styles.bufferingText}>Buffering...</Text>
          </View>
        )}

        {showControls && (
          <View
            style={[styles.controls, fullscreen && styles.fullscreenControls]}>
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleBackward}>
                <Image source={ImagePath.BACKWARD} style={styles.icon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handlePlayPause}>
                <Image
                  source={paused ? ImagePath.PLAY : ImagePath.PAUSE}
                  style={styles.playPauseIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleForward}>
                <Image source={ImagePath.FORWARD} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Slider
              style={styles.seekBar}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              minimumTrackTintColor={Color.RED}
              maximumTrackTintColor={Color.WHITE}
              thumbTintColor={Color.RED}
              onSlidingComplete={handleSeek}
              thumbStyle={styles.seekThumb}
            />
            <View
              style={[
                styles.timeContainer,
                {justifyContent: fullscreen ? 'space-around' : 'space-between'},
              ]}>
              <Text style={styles.durationText}>{formatTime(currentTime)}</Text>
              <Text style={styles.durationText}>{formatTime(duration)}</Text>
            </View>
            <View style={styles.bottomControls}>
              <View style={styles.controlGroup}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() =>
                    changePlaybackSpeed(playbackSpeed === 1.0 ? 1.5 : 1.0)
                  }>
                  <Image source={ImagePath.SPEED} style={styles.icon} />
                  <Text style={styles.controlText}>Speed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleLock}>
                  <Image
                    source={locked ? ImagePath.UNLOCK : ImagePath.LOCK}
                    style={styles.icon}
                  />
                  <Text style={styles.controlText}>Lock</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleVolume}>
                  <Image
                    source={
                      volume === 1.0 ? ImagePath.MEDIUMVOLUME : ImagePath.MUTE
                    }
                    style={styles.icon}
                  />
                  <Text style={styles.controlText}>Volume</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleFullscreen}>
                  <Image
                    source={
                      fullscreen ? ImagePath.MINIMIZE : ImagePath.FULLSIZE
                    }
                    style={styles.icon}
                  />
                  <Text style={styles.controlText}>
                    {fullscreen ? 'Minimize' : 'Full Size'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContainer: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
  },
  backgroundVideo: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  portraitVideo: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.RED,
  },
  bufferingText: {
    color: Color.WHITE,
    fontSize: moderateScale(20),
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'space-between',
  },
  fullscreenControls: {
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(16),
  },
  timeContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(8),
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  controlButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
    width: 'auto',
  },
  seekBar: {
    flex: 1,
    marginLeft: moderateScale(8),
    marginRight: moderateScale(8),
  },
  seekThumb: {
    width: moderateScale(16),
    height: moderateVerticalScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: Color.RED,
  },
  durationText: {
    color: Color.WHITE,
  },
  playPauseIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    tintColor: Color.WHITE,
  },
  bottomControls: {
    marginTop: moderateVerticalScale(8),
    paddingBottom: moderateVerticalScale(8),
  },
  icon: {
    width: moderateScale(26),
    height: moderateVerticalScale(26),
    tintColor: Color.WHITE,
  },
  controlText: {
    color: Color.WHITE,
    fontSize: moderateScale(12),
    marginTop: moderateVerticalScale(4),
  },
  backButton: {
    position: 'absolute',
    top: moderateVerticalScale(16),
    left: moderateScale(16),
    zIndex: 1,
  },
  backIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    tintColor: Color.WHITE,
  },
});
