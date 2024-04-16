import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import {image182, image342, image500} from '../../utils/Movie';
import firestore from '@react-native-firebase/firestore';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

const MyListScreen = ({route}) => {
  const [moviesList, setMoviesList] = useState([]);
  const [tvShowsList, setTvShowsList] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('myList')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const movies = list.filter(item => item.itemType === 'movie');
        const tvShows = list.filter(item => item.itemType === 'tvShow');

        setMoviesList(movies);
        setTvShowsList(tvShows);
      });

    return () => unsubscribe();
  }, []);

  const renderMovieItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={{uri: image500(item.itemImage)}} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  const renderTVShowItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={{uri: image500(item.itemImage)}} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.marginContainer}>
        <Text style={styles.heading}>My List</Text>
        <View style={styles.contentContainer}>
          <View style={styles.listContainer}>
            <Text style={styles.subHeading}>Movies</Text>
            <FlatList
              data={moviesList}
              renderItem={renderMovieItem}
              keyExtractor={item => item.id}
            />
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.subHeading}>TV Shows</Text>
            <FlatList
              data={tvShowsList}
              renderItem={renderTVShowItem}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MyListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Color.BLACK,
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
  },
  heading: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(16),
    color: Color.WHITE,
  },
  subHeading: {
    fontSize: scale(16),
    fontWeight: '700',
    marginTop: moderateVerticalScale(16),
    marginBottom: moderateVerticalScale(8),
    color: Color.WHITE,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  listContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  itemContainer: {
    marginBottom: 20,
    alignItems: 'center',
    color: Color.WHITE,
  },
  image: {
    width: moderateScale(150),
    height: moderateVerticalScale(150),
    marginTop: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    color: Color.WHITE,
  },
});
