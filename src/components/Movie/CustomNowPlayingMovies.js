import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import Color from '../../constants/Color';
import {NoImage, fetchNowPlayingMovies, image500} from '../../utils/Movie';

const CustomNowPlayingMovies = ({onPress}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetchNowPlayingMovies();
      setData(response?.results || []);
      // console.log('Data:', response?.results || []);
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      // console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const keyExtractor = (item, index) => index.toString();

  const renderMovies = ({item}) => (
    <View style={styles.row}>
      <View style={styles.item}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            onPress(item);
          }}>
          <Image
            source={{
              uri: image500(item.poster_path || NoImage),
            }}
            style={styles.poster}
            resizeMode="cover"
          />

          <Text style={styles.title}>
            {item.title.length > 12
              ? `${item.title.substring(0, 12)}...`
              : item.title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.RED} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data}
        renderItem={renderMovies}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default CustomNowPlayingMovies;

const styles = StyleSheet.create({
  row: {
    marginHorizontal: moderateScale(2),
  },
  item: {
    alignItems: 'center',
    backgroundColor: Color.BLACK_50,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
  },
  poster: {
    width: moderateScale(100),
    height: moderateVerticalScale(150),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Color.WHITE,
  },
});
