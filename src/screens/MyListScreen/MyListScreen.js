import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomIcon from '../../components/CustomIcon';
import {image342} from '../../utils/Movie';
import navigationString from '../../constants/navigationString';

const MyListScreen = ({navigation, route}) => {
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

  const navigateToVideoScreen = item => {
    navigation.navigate(navigationString.VIDEOSCREEN, {
      myListMovie: item,
      myListTv: item,
    });
  };

  const renderMovieItem = ({item}) => (
    <TouchableOpacity onPress={() => navigateToVideoScreen(item)}>
      <View style={styles.itemContainer}>
        <Image source={{uri: image342(item.itemImage)}} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTVShowItem = ({item}) => (
    <TouchableOpacity onPress={() => navigateToVideoScreen(item)}>
      <View style={styles.itemContainer}>
        <Image source={{uri: image342(item.itemImage)}} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CustomIcon
            name={'arrow-back-outline'}
            color={Color.WHITE}
            size={scale(24)}
            type="Ionicons"
          />
        </TouchableOpacity>
        <Text style={styles.heading}>My List</Text>
        <View style={{width: scale(24)}} />
      </View>
      <View style={styles.contentContainer}>
        {moviesList.length === 0 && tvShowsList.length === 0 ? (
          <Text style={styles.emptyListMessage}>
            Please add some data to the list first.
          </Text>
        ) : (
          <>
            <View style={styles.listContainer}>
              <Text style={styles.subHeading}>Movies</Text>
              {moviesList.length === 0 ? (
                <Text style={styles.emptyListMessage}>
                  You need to add some movies to your list.
                </Text>
              ) : (
                <FlatList
                  data={moviesList}
                  renderItem={renderMovieItem}
                  keyExtractor={item => item.id}
                />
              )}
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.subHeading}>TV Shows</Text>
              {tvShowsList.length === 0 ? (
                <Text style={styles.emptyListMessage}>
                  You need to add some TV shows to your list.
                </Text>
              ) : (
                <FlatList
                  data={tvShowsList}
                  renderItem={renderTVShowItem}
                  keyExtractor={item => item.id}
                />
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default MyListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateVerticalScale(16),
  },
  heading: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: Color.WHITE,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateVerticalScale(16),
  },
  listContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeading: {
    fontSize: scale(16),
    fontWeight: '700',
    marginBottom: moderateVerticalScale(8),
    color: Color.WHITE,
  },
  itemContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: moderateScale(150),
    height: moderateVerticalScale(150),
    resizeMode: 'cover',
  },
  title: {
    fontSize: scale(18),
    marginTop: 10,
    textAlign: 'center',
    color: Color.WHITE,
  },
  emptyListMessage: {
    fontSize: scale(16),
    marginTop: 20,
    textAlign: 'center',
    color: Color.WHITE,
  },
});
