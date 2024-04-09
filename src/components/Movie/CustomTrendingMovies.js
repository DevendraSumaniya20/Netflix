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
import {fetchTrendingMovies, image500} from '../../utils/Movie';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import Color from '../../constants/Color';

const CustomTrendingMovies = ({onPress}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetchTrendingMovies();
      setData(response?.results || []);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    } finally {
      setLoading(false);
    }
  };

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
              uri: image500(item.poster_path),
            }}
            style={styles.poster}
          />
          <Text style={styles.title}>
            {item.title.length > 16
              ? `${item.title.substring(0, 16)}...`
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
      {data.length === 0 ? (
        <Text style={styles.waitText}>
          No trending movies available at the moment
        </Text>
      ) : (
        <FlatList
          horizontal
          data={data}
          renderItem={renderMovies}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

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
});

export default CustomTrendingMovies;
