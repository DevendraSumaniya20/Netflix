import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fetchMovieDetails, fetchTvDetails, image500} from '../../utils/Movie';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomButton from '../../components/CustomButton';
import CustomIconText from '../../components/CustomIconText';

const VideoScreen = ({route, navigation}) => {
  const [movieData, setMovieData] = useState(null);

  const {itemIdMovie, itemIdTv} = route.params;

  useEffect(() => {
    if (itemIdMovie) {
      getMovieDetails();
    }

    if (itemIdTv) {
      getTvShowDetails();
    }
  }, [itemIdMovie, itemIdTv]);

  const getMovieDetails = useCallback(async () => {
    try {
      const movieDetails = await fetchMovieDetails(itemIdMovie);
      setMovieData(movieDetails);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }, [itemIdMovie]);

  const getTvShowDetails = useCallback(async () => {
    try {
      const tvData = await fetchTvDetails(itemIdTv);
      console.log(tvData);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
    }
  }, [itemIdTv]);

  const renderItem = () => {
    if (!movieData) return null;
    return (
      <View style={{flex: 1}}>
        <Image
          source={{uri: image500(movieData.poster_path)}}
          style={styles.poster}
          resizeMethod="auto"
          resizeMode="cover"
        />
        <Text style={styles.textStyle}>{movieData.title}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <Text style={styles.textStyle}>
            {movieData.release_date.split('-')[0]}
          </Text>
          <Text style={(styles.textStyle, {backgroundColor: Color.GRAY})}>
            U/A 16+
          </Text>
          <Text style={styles.textStyle}>
            {Math.floor(movieData.runtime / 60)}h {movieData.runtime % 60}m
          </Text>
        </View>

        <CustomIconText
          color={Color.BLACK}
          text={'Play'}
          iconName={'play'}
          type={'FontAwesome5'}
          onPress={() => {
            Alert.alert('hello');
          }}
          size={scale(25)}
          flexDirection="row"
          moreStyles={{
            gap: moderateScale(4),
            backgroundColor: Color.WHITE,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(5),
            paddingHorizontal: moderateScale(30),
            height: moderateVerticalScale(48),
            width: moderateScale(345),
          }}
          moreTextStyle={{
            color: Color.BLACK,
            fontWeight: '600',
            fontSize: scale(20),
          }}
        />

        <CustomIconText
          color={Color.WHITE}
          text={'Download'}
          iconName={'arrow-collapse-down'}
          type={'MaterialCommunityIcons'}
          onPress={() => {
            Alert.alert('download');
          }}
          size={scale(25)}
          flexDirection="row"
          moreStyles={{
            gap: moderateScale(4),
            backgroundColor: Color.GRAY,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(5),
            paddingHorizontal: moderateScale(30),
            height: moderateVerticalScale(48),
            width: moderateScale(345),
          }}
          moreTextStyle={{
            color: Color.WHITE,
            fontWeight: '600',
            fontSize: scale(20),
          }}
        />
        <View>
          <Text style={styles.textStyle}>{movieData.overview}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={{
          marginTop:
            Platform.OS === 'android' ? moderateVerticalScale(4) : null,
        }}>
        <View style={styles.marginContainer}>
          {movieData && (
            <FlatList
              data={[movieData]}
              renderItem={renderItem}
              keyExtractor={() => movieData?.id.toString()}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
  },
  poster: {
    width: moderateScale(340),
    height: moderateVerticalScale(300),
    borderRadius: moderateScale(10),
  },
  textStyle: {
    color: Color.WHITE,
  },
});
