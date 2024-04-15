import React, {useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import navigationString from '../../constants/navigationString';
import CustomIcon from '../../components/CustomIcon';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomComingSoonMovie from '../../components/Movie/CustomCommingSoonMovie';
import CustomOnAirTv from '../../components/Tv/CustomOnAirTv';

const ComingSoonScreen = ({navigation}) => {
  const [showMovies, setShowMovies] = useState(true);

  const onPressHandlerMovie = item => {
    navigation.navigate(navigationString.VIDEOSCREEN, {
      itemIdMovie: item.id,
    });
  };

  const onPressHandlerTv = item => {
    navigation.navigate(navigationString.VIDEOSCREEN, {
      itemIdTv: item.id,
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop:
            Platform.OS === 'android' ? moderateVerticalScale(0) : null,
        },
      ]}>
      <View style={styles.marginContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <CustomIcon
              name={'arrow-back-outline'}
              color={Color.WHITE}
              size={scale(24)}
              type="Ionicons"
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginVertical: moderateVerticalScale(8),
              gap: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: showMovies ? Color.RED : 'transparent',
                borderRadius: moderateScale(8),
                paddingHorizontal: moderateScale(8),
                paddingVertical: moderateVerticalScale(10),
              }}
              onPress={() => setShowMovies(true)}>
              <Text
                style={{
                  color: showMovies ? Color.WHITE : Color.WHITE_70,
                  fontWeight: '900',
                  fontSize: scale(14),
                }}>
                🍿 Upcoming Movies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: showMovies ? 'transparent' : Color.RED,
                borderRadius: moderateScale(16),
                paddingHorizontal: moderateScale(8),
                paddingVertical: moderateVerticalScale(10),
              }}
              onPress={() => setShowMovies(false)}>
              <Text
                style={{
                  color: showMovies ? Color.WHITE_70 : Color.WHITE,
                  fontWeight: '900',
                  fontSize: scale(14),
                }}>
                🎬 Coming New Show
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.mainHeader}>
            {showMovies
              ? 'Hot and Trending Movies'
              : 'Hot and Trending TV shows'}
          </Text>
        </View>

        {showMovies ? (
          <CustomComingSoonMovie onPress={onPressHandlerMovie} />
        ) : (
          <CustomOnAirTv onPress={onPressHandlerTv} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ComingSoonScreen;
