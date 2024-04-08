import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {fetchTrendingTvShows} from '../../utils/Movie';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import Color from '../../constants/Color';

const CustomTrendingTvShow = ({onPress}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrendingTvShows();
  }, []);

  const getTrendingTvShows = async () => {
    try {
      const response = await fetchTrendingTvShows();
      setData(response?.results || []);
      console.log(response?.results?.title);
    } catch (error) {
      console.error('Error fetching trending TvShows:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const renderTvShows = ({item}) => (
    <View style={styles.row}>
      <View style={styles.item}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            onPress(item);
          }}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w185/${item.poster_path}`,
            }}
            style={styles.poster}
          />
          {item.name && (
            <Text style={[styles.title, {}]}>
              {item.name.length > 12
                ? `${item.name.substring(0, 12)}...`
                : item.name}
            </Text>
          )}
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <Text style={styles.waitText}>Please wai for a moment</Text>
      ) : (
        <FlatList
          horizontal
          data={data}
          renderItem={renderTvShows}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

export default CustomTrendingTvShow;

const styles = StyleSheet.create({
  container: {},
  flatListContent: {},
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
  title: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Color.WHITE,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitText: {
    alignSelf: 'center',
    marginTop: moderateVerticalScale(50),
    fontSize: scale(18),
    fontWeight: '600',
    color: Color.WHITE,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: Color.RED,
  },
});
