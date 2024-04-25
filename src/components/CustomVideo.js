import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import Video from 'react-native-video';
import Color from '../constants/Color';
import ImagePath from '../constants/ImagePath';

const CustomVideo = ({uri, isVisible, isPaused}) => {
  const [buffering, setBuffering] = useState(false);
  const [paused, setPaused] = useState(isPaused);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const videoRef = useRef(null);

  useEffect(() => {
    setPaused(isPaused);
  }, [isPaused]);

  const onBuffer = isBuffering => {
    setBuffering(isBuffering);
  };

  const videoError = () => {
    // Handle video error
  };

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const handleSeek = seekTime => {
    videoRef.current.seek(seekTime);
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
    setDuration(data.duration);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const changePlaybackSpeed = speed => {
    setPlaybackSpeed(speed);
  };

  return (
    <View style={[styles.container, fullscreen && styles.fullscreenContainer]}>
      <Video
        source={uri}
        ref={videoRef}
        onBuffer={onBuffer}
        onError={videoError}
        onProgress={onProgress}
        paused={paused}
        volume={volume}
        rate={playbackSpeed}
        style={[styles.backgroundVideo, fullscreen && styles.fullscreenVideo]}
        resizeMode={fullscreen ? 'cover' : 'contain'}
      />
      {buffering && (
        <View style={styles.bufferingOverlay}>
          <Text style={styles.bufferingText}>Buffering...</Text>
        </View>
      )}

      <View style={styles.controls}>
        <View style={styles.seekBarContainer}>
          <TouchableOpacity onPress={() => handleSeek(currentTime - 10)}>
            <Image source={ImagePath.BACKWARD} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause}>
            <Image
              source={paused ? ImagePath.PLAY : ImagePath.PAUSE}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSeek(currentTime + 10)}>
            <Image source={ImagePath.FORWARD} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.durationText}>{formatTime(currentTime)}</Text>

        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => setVolume(volume === 1.0 ? 0.0 : 1.0)}>
          <Image
            source={volume === 1.0 ? ImagePath.MEDIUMVOLUME : ImagePath.MUTE}
            style={{width: 30, height: 30, tintColor: Color.WHITE}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fullscreenButton}
          onPress={toggleFullscreen}>
          <Image
            source={fullscreen ? ImagePath.MINIMIZE : ImagePath.FULLSIZE}
            style={{width: 30, height: 30, tintColor: Color.WHITE}}
          />
        </TouchableOpacity>
      </View>
    </View>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  backgroundVideo: {
    width: moderateScale(100),
    height: moderateVerticalScale(200),
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bufferingText: {
    color: '#fff',
    fontSize: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  seekBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    color: '#fff',
    marginLeft: 5,
    marginRight: 5,
  },
  volumeButton: {
    padding: 5,
  },
  fullscreenButton: {
    padding: 5,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: '#fff',
  },
});
