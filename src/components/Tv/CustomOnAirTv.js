import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import Color from '../../constants/Color';
import {fetchAiringTodayTvShows, image342} from '../../utils/Movie';
import CustomIconText from '../CustomIconText';

const CustomOnAirTv = ({onPress}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getOnAirTvShows();
  }, []);

  const getOnAirTvShows = async () => {
    try {
      const response = await fetchAiringTodayTvShows();
      setData(response?.results || []);
      // console.log(response?.results);
    } catch (error) {
      console.error('Error fetching Airing Today TV Shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTvShows = ({item}) => (
    <TouchableOpacity
      style={styles.tvContainer}
      activeOpacity={0.5}
      onPress={() => {
        onPress(item);
      }}>
      <Image
        source={{uri: image342(item.poster_path)}}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.iconsContainer}>
        <CustomIconText
          color={'#fff'}
          text={'Remind me'}
          iconName={'bell-alert'}
          type={'MaterialCommunityIcons'}
          onPress={() => {
            Alert.alert('hello');
          }}
          size={scale(25)}
        />
        <CustomIconText
          color={'#fff'}
          text={'Share'}
          iconName={'share-social-outline'}
          type={'Ionicons'}
          onPress={() => {
            Alert.alert('hello');
          }}
          size={scale(25)}
        />
      </View>
      <View style={styles.tvDetails}>
        <Text style={styles.title}>
          {item.name && item.name.length > 16
            ? `${item.name.substring(0, 16)}...`
            : item.name}
        </Text>
        <Text style={styles.overview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.RED} />
      </View>
    );
  }

  keyExtractor = (item, index) => index.toString();
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderTvShows}
        keyExtractor={this.keyExtractor}
      />
    </View>
  );
};

export default CustomOnAirTv;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tvContainer: {
    alignItems: 'center',
    backgroundColor: Color.BLACK_50,
    borderRadius: moderateScale(10),
    marginBottom: moderateVerticalScale(24),
  },
  poster: {
    width: moderateScale(343),
    height: moderateScale(450),
    borderRadius: moderateScale(10),
  },
  title: {
    fontSize: scale(24),
    fontWeight: '600',
    color: Color.WHITE,
    marginBottom: moderateVerticalScale(8),
  },
  tvDetails: {
    flex: 1,
    justifyContent: 'center',
    padding: moderateScale(5),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.BLACK,
  },
  overview: {
    fontSize: scale(14),
    color: Color.GRAY_2,
    fontWeight: '500',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(16),
    marginRight: moderateScale(-200),
    justifyContent: 'space-around',
  },
});
