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

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import Color from '../../constants/Color';
import {fetchPopularMovies, image500} from '../../utils/Movie';

const CustomPopularMovies = ({onPress}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetchPopularMovies();
      setData(response?.results || []);
    } catch (error) {
      console.error('Error fetching Popular movies:', error);
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

  keyExtractor = (item, index) => index.toString();

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data}
        renderItem={renderMovies}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default CustomPopularMovies;

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
