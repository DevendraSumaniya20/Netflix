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
  Modal,
} from 'react-native';
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieSimilar,
  fetchTvCredits,
  fetchTvDetails,
  fetchTvSimilar,
  image342,
  image500,
} from '../../utils/Movie';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomIconText from '../../components/CustomIconText';
import CustomIcon from '../../components/CustomIcon';
import {Avatar} from '@rneui/themed';

const VideoScreen = ({route, navigation}) => {
  const [movieData, setMovieData] = useState(null);
  const [tvShowData, setTvShowData] = useState(null);

  const [cast, setCast] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [genres, setGenres] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [similar, setSimilar] = useState([]);

  const {itemIdMovie, itemIdTv} = route.params;

  useEffect(() => {
    if (itemIdMovie) {
      getMovieDetails();
      getMovieCredits();
      getMovieSimilar();
    }

    if (itemIdTv) {
      getTvShowDetails();
      getTvShowCredits();
      getTvShowSimilar();
    }
  }, [itemIdMovie, itemIdTv]);

  const getMovieDetails = useCallback(async () => {
    try {
      const movieDetails = await fetchMovieDetails(itemIdMovie);
      setMovieData(movieDetails);
      setGenres(movieDetails.genres);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }, [itemIdMovie]);

  const getMovieCredits = useCallback(async () => {
    try {
      const credits = await fetchMovieCredits(itemIdMovie);
      setCast(credits.cast);
      setMovieData(prevData => ({...prevData, cast: credits.cast}));
    } catch (error) {
      console.error('Error fetching movie credits:', error);
    }
  }, [itemIdMovie]);

  const getMovieSimilar = useCallback(async () => {
    try {
      const similar = await fetchMovieSimilar(itemIdMovie);
      // console.log('............', similar);
      setSimilar(similar);
    } catch (error) {
      console.error('Error fetching movie credits:', error);
    }
  }, [itemIdMovie]);

  const getTvShowCredits = useCallback(async () => {
    try {
      const tvCredits = await fetchTvCredits(itemIdTv);
      setCast(tvCredits.cast);
      setTvShowData(prevData => ({...prevData, cast: tvCredits.cast}));
    } catch (error) {
      console.error('Error fetching TV show details:', error);
    }
  }, [itemIdTv]);

  const getTvShowSimilar = useCallback(async () => {
    try {
      const similar = await fetchTvSimilar(itemIdTv);
      setSimilar(similar);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
    }
  }, [itemIdTv]);

  const getTvShowDetails = useCallback(async () => {
    try {
      const tvData = await fetchTvDetails(itemIdTv);
      setGenres(tvData.genres);
      setTvShowData(tvData);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
    }
  }, [itemIdTv]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleTabPress = tabNumber => {
    setActiveTab(tabNumber);
  };

  const renderItemMovie = () => {
    if (!movieData) return null;
    return (
      <View style={{flex: 1}}>
        <Image
          source={{
            uri: image500(movieData.backdrop_path || movieData.poster_path),
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <Text style={styles.titleTextStyle}>
          {movieData.title || movieData.original_title}
        </Text>

        {/* <Text style={styles.textStyle}>{movieData.id}</Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: moderateVerticalScale(8),
          }}>
          <Text style={styles.releasedateTextStyle}>
            {movieData.release_date.split('-')[0]}
          </Text>
          {movieData.adult === false ? (
            <Text style={styles.underAgeTextStyle}>U/A 16+</Text>
          ) : null}

          <Text style={styles.runtimeTextStyle}>
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
          <Text style={styles.overviewTextStyle}>{movieData.overview}</Text>

          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.StarringOverViewTextStyle}>Starring:</Text>
            {cast.slice(0, 4).map((actor, index) => (
              <Text key={index} style={[styles.StarringTextStyle]}>
                {actor.name}
              </Text>
            ))}
            {cast.length > 4 && (
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.moreTextStyle}>... more</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.directorTextStyle}>Director : </Text>
            {movieData.production_companies.map((company, index) => (
              <Text key={index} style={styles.companyTextStyle}>
                {company.name}
              </Text>
            ))}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <CustomIconText
            color={Color.WHITE}
            text={'My list'}
            iconName={'plus'}
            type={'AntDesign'}
            onPress={() => {
              Alert.alert('hello');
            }}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
            size={scale(25)}
          />
          <CustomIconText
            color={Color.WHITE}
            text={'Rate'}
            iconName={'like'}
            type={'EvilIcons'}
            onPress={() => {
              Alert.alert('hello');
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
          <CustomIconText
            color={Color.WHITE}
            text={'Share'}
            iconName={'share'}
            type={'Entypo'}
            onPress={() => {
              Alert.alert('hello');
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
          <CustomIconText
            color={Color.WHITE}
            text={'Download'}
            iconName={'download-multiple'}
            type={'MaterialCommunityIcons'}
            onPress={() => {
              Alert.alert('hello');
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 1 && styles.activeTab]}
            onPress={() => handleTabPress(1)}>
            <Text style={styles.tabButtonText}>Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 2 && styles.activeTab]}
            onPress={() => handleTabPress(2)}>
            <Text style={styles.tabButtonText}>More Like This</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItemTvShow = () => {
    if (!tvShowData) return null;
    return (
      <View style={{flex: 1}}>
        <Image
          source={{
            uri: image500(tvShowData.backdrop_path || tvShowData.poster_path),
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <Text style={styles.titleTextStyle}>
          {tvShowData.name || tvShowData.original_name}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: moderateVerticalScale(8),
          }}>
          <Text style={styles.releasedateTextStyle}>
            {tvShowData.first_air_date.split('-')[0]}
          </Text>
          {tvShowData.adult === false ? (
            <Text style={styles.underAgeTextStyle}>U/A 16+</Text>
          ) : null}

          <Text style={styles.runtimeTextStyle}>
            {tvShowData.episode_run_time.length > 0
              ? `${Math.floor(tvShowData.episode_run_time[0] / 60)}h ${
                  tvShowData.episode_run_time[0] % 60
                }m`
              : 'N/A'}
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
          <Text style={styles.overviewTextStyle}>{tvShowData.overview}</Text>

          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.StarringOverViewTextStyle}>Starring:</Text>
            {cast.slice(0, 4).map((actor, index) => (
              <Text key={index} style={[styles.StarringTextStyle]}>
                {actor.name}
              </Text>
            ))}
            {cast.length > 4 && (
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.moreTextStyle}>... more</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.directorTextStyle}>Director : </Text>
            {tvShowData.production_companies.map((company, index) => (
              <Text key={index} style={styles.companyTextStyle}>
                {company.name}
              </Text>
            ))}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <CustomIconText
            color={Color.WHITE}
            text={'My list'}
            iconName={'plus'}
            type={'AntDesign'}
            onPress={() => {
              Alert.alert('hello');
            }}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
            size={scale(25)}
          />
          <CustomIconText
            color={Color.WHITE}
            text={'Rate'}
            iconName={'like'}
            type={'EvilIcons'}
            onPress={() => {
              Alert.alert('hello');
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
          <CustomIconText
            color={Color.WHITE}
            text={'Share'}
            iconName={'share'}
            type={'Entypo'}
            onPress={() => {
              Alert.alert('hello');
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
          <CustomIconText
            color={Color.WHITE}
            text={'Download'}
            iconName={'download-multiple'}
            type={'MaterialCommunityIcons'}
            onPress={() => {
              Alert.alert('hello');
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 1 && styles.activeTab]}
            onPress={() => handleTabPress(1)}>
            <Text style={styles.tabButtonText}>Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 2 && styles.activeTab]}
            onPress={() => handleTabPress(2)}>
            <Text style={styles.tabButtonText}>More Like This</Text>
          </TouchableOpacity>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
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
                gap: 20,
                marginRight: moderateScale(4),
              }}>
              <TouchableOpacity onPress={() => {}}>
                <CustomIcon
                  name={'search-outline'}
                  color={Color.WHITE}
                  size={scale(24)}
                  type="Ionicons"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Avatar
                  size={32}
                  rounded
                  source={{
                    uri: 'https://randomuser.me/api/portraits/men/36.jpg',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <CustomIcon />
          {movieData && (
            <FlatList
              data={[movieData]}
              renderItem={renderItemMovie}
              keyExtractor={() => movieData?.id.toString()}
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{paddingBottom: moderateScale(500)}}
            />
          )}

          {tvShowData && (
            <FlatList
              data={[tvShowData]}
              renderItem={renderItemTvShow}
              keyExtractor={() => tvShowData?.id.toString()}
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{paddingBottom: moderateScale(500)}}
            />
          )}
        </View>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={toggleModal}>
                <CustomIcon
                  color={Color.WHITE}
                  name={'cross'}
                  size={scale(26)}
                  type="Entypo"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>Cast</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cast}
              renderItem={({item}) => (
                <Text style={styles.modalItem}> • {item.name}</Text>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <Text style={styles.modalTitle}>Genres</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={genres}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.genreItemContainer}>
                  <Text style={styles.modalItem}> • {item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
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
    width: moderateScale(350),
    height: moderateVerticalScale(350),
    borderRadius: moderateScale(10),
  },
  textStyle: {
    color: Color.WHITE,
  },
  titleTextStyle: {
    color: Color.WHITE,
    fontSize: scale(24),
    fontWeight: '800',
    marginVertical: moderateScale(8),
  },
  runtimeTextStyle: {
    color: Color.WHITE,
    marginHorizontal: moderateScale(6),
    fontSize: scale(14),
  },
  releasedateTextStyle: {
    color: Color.WHITE,
    fontSize: scale(14),
  },
  underAgeTextStyle: {
    backgroundColor: Color.GRAY,
    marginHorizontal: moderateScale(24),
    color: Color.WHITE,
    paddingHorizontal: moderateScale(8),
    fontSize: scale(14),
    textAlign: 'center',
  },
  overviewTextStyle: {
    color: Color.WHITE,
    fontSize: scale(14),
    marginVertical: moderateVerticalScale(8),
  },
  StarringOverViewTextStyle: {color: Color.WHITE, fontSize: scale(14)},
  StarringTextStyle: {
    color: Color.GRAY,
    fontSize: scale(14),
    marginBottom: moderateVerticalScale(2),
  },
  moreTextStyle: {color: Color.WHITE, fontSize: scale(14)},
  directorTextStyle: {color: Color.WHITE, fontSize: scale(14)},
  companyTextStyle: {color: Color.GRAY, fontSize: scale(14)},

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.BLACK_50,
  },
  modalContent: {
    backgroundColor: Color.BLACK_90,
    borderRadius: moderateScale(10),
    padding: moderateScale(20),
    maxHeight: '100%',
    alignItems: 'center',
    width: '100%',
  },

  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(10),
    color: Color.WHITE,
  },
  modalItem: {
    fontSize: scale(16),
    marginBottom: moderateVerticalScale(8),
    color: Color.GRAY_2,
  },
  genreItemContainer: {
    width: '100%',
  },
  closeButtonContainer: {
    alignItems: 'center',
    marginRight: moderateScale(-300),
    marginTop: moderateScale(16),
    flexDirection: 'row',
  },
  tabButton: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateVerticalScale(10),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: Color.WHITE,
  },
  activeTab: {
    borderBottomColor: 'blue',
  },
});
