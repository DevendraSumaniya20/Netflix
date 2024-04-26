import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieSimilar,
  fetchTvCredits,
  fetchTvDetails,
  fetchTvSimilar,
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
import {Avatar, Tab} from '@rneui/themed';
import navigationString from '../../constants/navigationString';
import {auth} from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import ImagePath from '../../constants/ImagePath';
import styles from './Styles';
import CustomVideo from '../../components/CustomVideo';

const VideoScreen = ({route, navigation}) => {
  const [movieData, setMovieData] = useState(null);
  const [tvShowData, setTvShowData] = useState(null);

  const [cast, setCast] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [genres, setGenres] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const {itemIdMovie, itemIdTv, myListItem, searchItem} = route.params;

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      checkAuthStatus(currentUser);
    }
  }, []);

  const checkAuthStatus = currentUser => {
    if (!currentUser) {
      navigation.navigate(navigationString.LOGINSCREEN);
    }
  };

  useEffect(() => {
    fetchData();
  }, [itemIdMovie, itemIdTv, myListItem, searchItem]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (itemIdMovie || myListItem) {
        await fetchAndSetMovieData(itemIdMovie || myListItem);
      } else if (itemIdTv) {
        await fetchAndSetTvData(itemIdTv);
      } else if (searchItem) {
        let movieDetails = await fetchMovieDetails(searchItem);
        let credits, similarData;

        if (movieDetails) {
          credits = await fetchMovieCredits(searchItem);
          similarData = await fetchMovieSimilar(searchItem);
        } else {
          let tvDetails = await fetchTvDetails(searchItem);

          if (tvDetails) {
            movieDetails = tvDetails;
            credits = await fetchTvCredits(searchItem);
            similarData = await fetchTvSimilar(searchItem);
          }
        }

        if (movieDetails) {
          setMovieData(movieDetails);
          setCast(credits.cast);
          setGenres(movieDetails.genres);
          setSimilar(similarData?.results || []);
        } else {
          console.error('No data found for search item:', searchItem);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [itemIdMovie, itemIdTv, myListItem, searchItem]);

  const fetchAndSetMovieData = async itemId => {
    const movieDetails = await fetchMovieDetails(itemId);
    if (movieDetails) {
      const credits = await fetchMovieCredits(itemId);
      const similarData = await fetchMovieSimilar(itemId);
      setMovieData(movieDetails);
      setCast(credits.cast);
      setGenres(movieDetails.genres);
      setSimilar(similarData?.results || []);
    } else {
      console.error('No data found for movie with ID:', itemId);
    }
  };

  const fetchAndSetTvData = async itemId => {
    const tvData = await fetchTvDetails(itemId);
    if (tvData) {
      const credits = await fetchTvCredits(itemId);
      const similarTvData = await fetchTvSimilar(itemId);
      setTvShowData(tvData);
      setCast(credits.cast);
      setGenres(tvData.genres);
      setSimilar(similarTvData?.results || []);
    } else {
      console.error('No data found for TV show with ID:', itemId);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    let timer;
    if (isVideoPlaying) {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    } else {
      setShowControls(true);
    }

    return () => clearTimeout(timer);
  }, [isVideoPlaying, setShowControls]);

  const renderItemMovie = () => {
    if (!movieData) return null;

    let release_year;
    if (movieData.release_date) {
      release_year = movieData.release_date.split('-')[0];
    } else if (myListItem && myListItem.release_date) {
      release_year = myListItem.release_date.split('-')[0];
    } else if (myListItem && myListItem.releaseYear) {
      release_year = myListItem.releaseYear;
    } else {
      release_year = 'Release Year Not Available';
    }

    const collectionData = movieData.belongs_to_collection;

    return (
      <View style={{flex: 1}}>
        <View style={{position: 'relative'}}>
          {isVideoPlaying ? (
            <CustomVideo
              uri={
                myListItem
                  ? myListItem.itemVideo
                  : require('../../assets/video/videoplayback.mp4')
              }
              isVisible={isVideoPlaying}
              isPaused={!isVideoPlaying}
            />
          ) : (
            <Image
              source={{
                uri: myListItem
                  ? image500(myListItem.itemImage)
                  : image500(movieData.backdrop_path || movieData.poster_path),
              }}
              style={styles.poster}
              resizeMode="cover"
            />
          )}

          {showControls && (
            <TouchableOpacity
              onPress={() => {
                if (isVideoPlaying) {
                  setVideoPlaying(false);
                } else {
                  setVideoPlaying(true);
                }
              }}
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                top: '50%',
                left: '50%',
                transform: [{translateX: -30}, {translateY: -30}],
                width: moderateScale(60),
                height: moderateVerticalScale(60),
              }}>
              <CustomIcon
                color={Color.RED}
                name={isVideoPlaying ? 'pause' : 'play'}
                size={scale(60)}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.titleTextStyle}>
          {myListItem
            ? myListItem.title
            : movieData.title || movieData.original_title}
        </Text>

        {/* <Text style={styles.textStyle}>{movieData.id}</Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: moderateVerticalScale(8),
          }}>
          <Text style={styles.releasedateTextStyle}>{release_year}</Text>
          {movieData.adult === false ? (
            <Text style={styles.underAgeTextStyle}>U/A 16+</Text>
          ) : (
            <Text style={styles.underAgeTextStyle}>U/A 16+</Text>
          )}

          <Text style={styles.runtimeTextStyle}>
            {myListItem && myListItem.runtime
              ? myListItem.runtime
              : `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m`}
          </Text>
        </View>

        <CustomIconText
          color={Color.BLACK}
          text={isVideoPlaying ? 'Pause' : 'Play'}
          iconName={isVideoPlaying ? 'pause' : 'play'}
          type={'FontAwesome5'}
          onPress={() => {
            if (isVideoPlaying) {
              setVideoPlaying(false);
            } else {
              setVideoPlaying(true);
            }
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
            addToMyMovieDownloadList();
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
          <Text style={styles.overviewTextStyle}>
            {myListItem ? myListItem.overview : movieData.overview}
          </Text>

          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.StarringOverViewTextStyle}>Starring:</Text>

            {cast &&
              cast.slice(0, 4).map((actor, index) => (
                <Text key={index} style={[styles.StarringTextStyle]}>
                  {actor.name}
                </Text>
              ))}

            {myListItem &&
              myListItem.cast &&
              myListItem.cast.length > 0 &&
              myListItem.cast.slice(0, 4).map((actor, index) => (
                <Text key={index} style={[styles.StarringTextStyle]}>
                  {actor.name}
                </Text>
              ))}

            {(cast && cast.length > 4) ||
              (myListItem && myListItem.cast && myListItem.cast.length > 4 && (
                <TouchableOpacity onPress={toggleModal}>
                  <Text style={styles.moreTextStyle}>... more</Text>
                </TouchableOpacity>
              ))}
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.directorTextStyle}>Director : </Text>

            {myListItem &&
            myListItem.productionCompanies &&
            myListItem.productionCompanies.length > 0 ? (
              myListItem.productionCompanies.map((company, index) => (
                <Text key={index} style={styles.companyTextStyle}>
                  {company}
                </Text>
              ))
            ) : movieData &&
              movieData.production_companies &&
              movieData.production_companies.length > 0 ? (
              movieData.production_companies.map((company, index) => (
                <Text key={index} style={styles.companyTextStyle}>
                  {company.name}
                </Text>
              ))
            ) : (
              <Text style={styles.companyTextStyle}>Unknown</Text>
            )}
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
            text={myListItem ? 'Saved' : 'My List'}
            iconName={myListItem ? 'check' : 'plus'}
            type={'AntDesign'}
            onPress={addToMyMovieList}
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
              addToMyMovieDownloadList();
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
        </View>
        <Tab value={index} onChange={setIndex}>
          <Tab.Item title="Collection" style={{backgroundColor: 'blue'}} />
          <Tab.Item title="More Like This" />
        </Tab>

        {index === 0 && (
          <>
            {collectionData && collectionData.poster_path ? (
              <Image
                source={{uri: image500(collectionData.backdrop_path)}}
                style={styles.collectionImageMovie}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{
                  uri: myListItem
                    ? image500(myListItem.itemImage)
                    : image500(
                        movieData.backdrop_path || movieData.poster_path,
                      ),
                }}
                style={styles.collectionImageMovie}
                resizeMode="cover"
              />
            )}
          </>
        )}

        {index === 1 && (
          <>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
              }}>
              {similar.map((movie, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.push(navigationString.VIDEOSCREEN, {
                      movie: movie,
                    });
                  }}>
                  <Image
                    source={{
                      uri: movie.poster_path
                        ? image500(movie.poster_path)
                        : ImagePath.NOIMAGE,
                    }}
                    style={[
                      styles.similarimages,
                      {
                        marginBottom:
                          index % 2 === 1 ? moderateVerticalScale(8) : 0,
                      },
                    ]}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}

              {myListItem &&
                myListItem.similarMovies &&
                myListItem.similarMovies.map((movie, index) => (
                  <Image
                    key={index}
                    source={{
                      uri: movie.poster_path
                        ? image500(movie.poster_path)
                        : image500(ImagePath.NOIMAGE),
                    }}
                    style={[
                      styles.similarimages,
                      {
                        marginBottom:
                          index % 2 === 1 ? moderateVerticalScale(8) : 0,
                      },
                    ]}
                    resizeMode="cover"
                  />
                ))}
            </View>
          </>
        )}
      </View>
    );
  };

  const renderItemTvShow = () => {
    if (!tvShowData) return null;

    const collectionData = tvShowData.backdrop_path;
    let runtime;
    if (tvShowData.episode_run_time) {
      runtime = tvShowData.episode_run_time.length;
    } else {
      runtime = 0;
    }

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
            {tvShowData.first_air_date &&
              tvShowData.first_air_date.split('-')[0]}
          </Text>
          {tvShowData.adult === false ? (
            <Text style={styles.underAgeTextStyle}>U/A 16+</Text>
          ) : null}

          <Text style={styles.runtimeTextStyle}>
            {runtime && runtime.length > 0
              ? `${Math.floor(runtime[0] / 60)}h ${runtime[0] % 60}m`
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
            addToMyTvShowDownloadList();
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
            {cast &&
              cast.slice(0, 4).map((actor, index) => (
                <Text key={index} style={[styles.StarringTextStyle]}>
                  {actor.name}
                </Text>
              ))}

            {cast && cast.length > 4 && (
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.moreTextStyle}>... more</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.directorTextStyle}>Director : </Text>
            {tvShowData.production_companies &&
              tvShowData.production_companies.map((company, index) => (
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
            text={myListItem ? 'Saved' : 'My List'}
            iconName={myListItem ? 'check' : 'plus'}
            type={'AntDesign'}
            onPress={addToMyTvShowList}
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
              addToMyTvShowDownloadList();
            }}
            size={scale(25)}
            moreStyles={{alignItems: 'center'}}
            moreTextStyle={{textAlign: 'center'}}
          />
        </View>

        <Tab value={index} onChange={setIndex}>
          <Tab.Item title="Collection" />
          <Tab.Item title="More Like This" />
        </Tab>

        {index === 0 && (
          <>
            <Text>Collection</Text>
            {collectionData && collectionData.backdrop_path ? (
              <Image
                source={{uri: image500(collectionData.backdrop_path)}}
                style={styles.collectionImageTv}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{
                  uri: image500(
                    tvShowData.backdrop_path || tvShowData.poster_path,
                  ),
                }}
                style={styles.collectionImageTv}
                resizeMode="cover"
              />
            )}
          </>
        )}

        {index === 1 && (
          <>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: moderateScale(30),
                justifyContent: 'space-evenly',
              }}>
              {similar.map((tvShow, index) => (
                <TouchableOpacity key={index} onPress={() => {}}>
                  {tvShow.poster_path && (
                    <Image
                      source={{
                        uri: tvShow.poster_path
                          ? image500(tvShow.poster_path)
                          : image500(ImagePath.NOIMAGE),
                      }}
                      style={[
                        styles.similarimages,
                        {
                          marginBottom:
                            index % 2 === 1 ? moderateVerticalScale(16) : 0,
                          marginLeft:
                            index === similar.length - 1 ? 0 : moderateScale(8),
                        },
                      ]}
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

  const addToMyMovieList = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found');
        return;
      }

      const movieDetails = await fetchMovieDetails(itemIdMovie);
      const castDetails = await fetchMovieCredits(itemIdMovie);
      const similarMovieDetails = await fetchMovieSimilar(itemIdMovie);

      let cast = [];
      if (castDetails.cast && castDetails.cast.length > 0) {
        cast = castDetails.cast.map(member => ({
          name: member.name,
          // profilePath: member.profile_path,
        }));
      }

      let productionCompanies = [];
      if (
        movieDetails.production_companies &&
        movieDetails.production_companies.length > 0
      ) {
        productionCompanies = movieDetails.production_companies.map(
          company => company.name,
        );
      }

      let imageUrl = movieDetails.poster_path || movieDetails.backdrop_path;
      let title = movieDetails.title || movieDetails.original_title;
      let overview = movieDetails.overview;
      let genres = movieDetails.genres
        ? movieDetails.genres.map(genre => genre.name).join(', ')
        : 'Genres unavailable';
      let runtime = `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`;
      let releaseYear = movieDetails.release_date
        ? movieDetails.release_date.split('-')[0]
        : 'Release date unavailable';

      const itemId = uuid.v4();

      const userId = currentUser.uid;

      const existingItemQuery = await firestore()
        .collection('myList')
        .where('itemId', '==', itemIdMovie)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!existingItemQuery.empty) {
        Alert.alert('Item already added to My List!');
        return;
      }

      const existingItems = await firestore()
        .collection('myList')
        .where('itemId', '==', itemId)
        .limit(1)
        .get();

      if (!existingItems.empty) {
        Alert.alert('Item already exists in the list!');
        return;
      }

      const addItemResponse = await firestore().collection('myList').add({
        itemId: itemIdMovie,
        userId: userId,
        itemType: 'movie',
        itemImage: imageUrl,
        title: title,
        overview: overview,
        genres: genres,
        cast: cast,
        runtime: runtime,
        releaseYear: releaseYear,
        similarMovies: similarMovieDetails.results,
        productionCompanies: productionCompanies,
      });

      if (addItemResponse) {
        Alert.alert('Movie added to My List successfully!');
      }
    } catch (error) {
      console.error('Error adding movie to My List:', error);
    }
  };

  const addToMyMovieDownloadList = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found');
        return;
      }

      const movieDetails = await fetchMovieDetails(itemIdMovie);
      const castDetails = await fetchMovieCredits(itemIdMovie);
      const similarMovieDetails = await fetchMovieSimilar(itemIdMovie);

      let cast = [];
      if (castDetails.cast && castDetails.cast.length > 0) {
        cast = castDetails.cast.map(member => ({
          name: member.name,
          // profilePath: member.profile_path,
        }));
      }

      let productionCompanies = [];
      if (
        movieDetails.production_companies &&
        movieDetails.production_companies.length > 0
      ) {
        productionCompanies = movieDetails.production_companies.map(
          company => company.name,
        );
      }

      let imageUrl = movieDetails.poster_path || movieDetails.backdrop_path;
      let title = movieDetails.title || movieDetails.original_title;
      let overview = movieDetails.overview;
      let genres = movieDetails.genres
        ? movieDetails.genres.map(genre => genre.name).join(', ')
        : 'Genres unavailable';
      let runtime = `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`;
      let releaseYear = movieDetails.release_date
        ? movieDetails.release_date.split('-')[0]
        : 'Release date unavailable';

      const itemId = uuid.v4();

      const userId = currentUser.uid;

      const existingItemQuery = await firestore()
        .collection('myDownloads')
        .where('itemId', '==', itemIdMovie)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!existingItemQuery.empty) {
        Alert.alert('Item already added to My List!');
        return;
      }

      const existingItems = await firestore()
        .collection('myDownloads')
        .where('itemId', '==', itemId)
        .limit(1)
        .get();

      if (!existingItems.empty) {
        Alert.alert('Item already exists in the list!');
        return;
      }

      const addItemResponse = await firestore().collection('myDownloads').add({
        itemId: itemIdMovie,
        userId: userId,
        itemType: 'movie',
        itemImage: imageUrl,
        title: title,
        overview: overview,
        genres: genres,
        cast: cast,
        runtime: runtime,
        releaseYear: releaseYear,
        similarMovies: similarMovieDetails.results,
        productionCompanies: productionCompanies,
      });

      if (addItemResponse) {
        Alert.alert('Movie added to My List successfully!');
      }
    } catch (error) {
      console.error('Error adding movie to My List:', error);
    }
  };

  const addToMyTvShowList = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found');
        return;
      }

      const tvShowDetails = await fetchTvDetails(itemIdTv);
      const castDetails = await fetchTvCredits(itemIdTv);
      const similarMovieDetails = await fetchTvSimilar(itemIdTv);

      let cast = [];
      if (castDetails.cast && castDetails.cast.length > 0) {
        cast = castDetails.cast.map(member => ({
          name: member.name,
          // profilePath: member.profile_path,
        }));
      }

      let productionCompanies = [];
      if (
        tvShowDetails.production_companies &&
        tvShowDetails.production_companies.length > 0
      ) {
        productionCompanies = tvShowDetails.production_companies.map(
          company => company.name,
        );
      }

      let imageUrl = tvShowDetails.poster_path || tvShowDetails.backdrop_path;
      let title = tvShowDetails.name || tvShowDetails.original_name;
      let overview = tvShowDetails.overview;
      let genres = tvShowDetails.genres
        ? tvShowDetails.genres.map(genre => genre.name).join(', ')
        : 'Genres unavailable';

      let runtime =
        tvShowDetails.episode_run_time &&
        tvShowDetails.episode_run_time.length > 0
          ? `${Math.floor(tvShowDetails.episode_run_time[0] / 60)}h ${tvShowDetails.episode_run_time[0] % 60}m`
          : 'N/A';
      let releaseYear = tvShowDetails.first_air_date
        ? tvShowDetails.first_air_date.split('-')[0]
        : 'Release date unavailable';

      const itemId = uuid.v4();

      const userId = currentUser.uid;

      const existingItemQuery = await firestore()
        .collection('myList')
        .where('itemId', '==', itemIdTv)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!existingItemQuery.empty) {
        Alert.alert('Item already added to My List!');
        return;
      }

      const existingItems = await firestore()
        .collection('myList')
        .where('itemId', '==', itemId)
        .limit(1)
        .get();

      if (!existingItems.empty) {
        Alert.alert('Item already exists in the list!');
        return;
      }

      const addItemResponse = await firestore().collection('myList').add({
        itemId: itemIdTv,
        userId: userId,
        itemType: 'tv',
        itemImage: imageUrl,
        title: title,
        overview: overview,
        genres: genres,
        cast: cast,
        runtime: runtime,
        releaseYear: releaseYear,
        similarMovies: similarMovieDetails.results,
        productionCompanies: productionCompanies,
      });

      if (addItemResponse) {
        Alert.alert('Tv Show added to My List successfully!');
      }
    } catch (error) {
      console.error('Error adding Tv show to My List:', error);
    }
  };

  const addToMyTvShowDownloadList = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found');
        return;
      }

      const tvShowDetails = await fetchTvDetails(itemIdTv);
      const castDetails = await fetchTvCredits(itemIdTv);
      const similarMovieDetails = await fetchTvSimilar(itemIdTv);

      let cast = [];
      if (castDetails.cast && castDetails.cast.length > 0) {
        cast = castDetails.cast.map(member => ({
          name: member.name,
          // profilePath: member.profile_path,
        }));
      }

      let productionCompanies = [];
      if (
        tvShowDetails.production_companies &&
        tvShowDetails.production_companies.length > 0
      ) {
        productionCompanies = tvShowDetails.production_companies.map(
          company => company.name,
        );
      }

      let imageUrl = tvShowDetails.poster_path || tvShowDetails.backdrop_path;
      let title = tvShowDetails.name || tvShowDetails.original_name;
      let overview = tvShowDetails.overview;
      let genres = tvShowDetails.genres
        ? tvShowDetails.genres.map(genre => genre.name).join(', ')
        : 'Genres unavailable';

      let runtime =
        tvShowDetails.episode_run_time &&
        tvShowDetails.episode_run_time.length > 0
          ? `${Math.floor(tvShowDetails.episode_run_time[0] / 60)}h ${tvShowDetails.episode_run_time[0] % 60}m`
          : 'N/A';
      let releaseYear = tvShowDetails.first_air_date
        ? tvShowDetails.first_air_date.split('-')[0]
        : 'Release date unavailable';

      const itemId = uuid.v4();

      const userId = currentUser.uid;

      const existingItemQuery = await firestore()
        .collection('myDownloads')
        .where('itemId', '==', itemIdTv)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!existingItemQuery.empty) {
        Alert.alert('Item already added to My List!');
        return;
      }

      const existingItems = await firestore()
        .collection('myDownloads')
        .where('itemId', '==', itemId)
        .limit(1)
        .get();

      if (!existingItems.empty) {
        Alert.alert('Item already exists in the list!');
        return;
      }

      const addItemResponse = await firestore().collection('myDownloads').add({
        itemId: itemIdTv,
        userId: userId,
        itemType: 'tv',
        itemImage: imageUrl,
        title: title,
        overview: overview,
        genres: genres,
        cast: cast,
        runtime: runtime,
        releaseYear: releaseYear,
        similarMovies: similarMovieDetails.results,
        productionCompanies: productionCompanies,
      });

      if (addItemResponse) {
        Alert.alert('Tv Show added to My List successfully!');
      }
    } catch (error) {
      console.error('Error adding Tv show to My List:', error);
    }
  };

  keyExtractor = (item, index) => index.toString();

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Color.WHITE}
          style={styles.loadingContainer}
        />
      ) : (
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
                        uri: 'https://comicvine.gamespot.com/a/uploads/original/11145/111457205/7969327-asta-18.jpg',
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
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    paddingBottom: moderateScale(500),
                  }}
                />
              )}
              {tvShowData && (
                <FlatList
                  data={[tvShowData]}
                  renderItem={renderItemTvShow}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    paddingBottom: moderateScale(3000),
                  }}
                />
              )}
            </View>
          </SafeAreaView>
        </View>
      )}
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
