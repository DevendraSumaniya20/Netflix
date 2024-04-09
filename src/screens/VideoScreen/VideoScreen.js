// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from 'react-native';
// import {
//   scale,
//   moderateScale,
//   moderateVerticalScale,
// } from 'react-native-size-matters';
// import Color from '../../constants/Color';
// import CustomHeader from '../../components/CustomHeader';
// import CustomIcon from '../../components/CustomIcon';
// import {Avatar} from '@rneui/themed';
// import {fetchMovieDetails, fetchTvDetails, image500} from '../../utils/Movie';

// const VideoScreen = ({navigation, route}) => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([]);

//   const {itemId} = route.params;
//   console.log(itemId);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         if (itemId.startsWith('movie')) {
//           const movieData = await fetchMovieDetails(itemId);
//           setData(movieData);
//         } else if (itemId.startsWith('tv')) {
//           const tvData = await fetchTvDetails(itemId);
//           setData(tvData);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [itemId]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!data) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>No data available</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={{flex: 1, backgroundColor: Color.BLACK}}>
//       <SafeAreaView style={styles.container}>
//         <View style={styles.marginView}>
//           <View style={styles.header}>
//             <View style={styles.headerLeft}>
//               <CustomHeader
//                 color={Color.WHITE}
//                 size={scale(24)}
//                 iconName={'arrow-back-outline'}
//                 onPress={() => {
//                   navigation.goBack();
//                 }}
//               />
//             </View>
//             <View style={styles.headerRight}>
//               <TouchableOpacity activeOpacity={0.5}>
//                 <CustomIcon
//                   color={Color.WHITE}
//                   name={'search-sharp'}
//                   size={scale(24)}
//                   type={'Ionicons'}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity activeOpacity={0.5}>
//                 <Avatar
//                   size={42}
//                   rounded
//                   source={{
//                     uri: 'https://randomuser.me/api/portraits/men/36.jpg',
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.imageView}>
//             <Image
//               resizeMethod="auto"
//               resizeMode="cover"
//               source={{
//                 uri: image500(data?.poster_path),
//               }}
//               style={styles.videoImage}
//             />
//           </View>

//           <View style={styles.detailsView}>
//             <Text style={styles.title}>
//               {data.title || data.original_title}
//             </Text>
//             <View style={styles.infoContainer}>
//               <Text style={styles.infoText}>
//                 Release Date: {data.release_date}
//               </Text>
//               <Text style={styles.infoText}>Popularity: {data.popularity}</Text>
//               <Text style={styles.infoText}>Runtime: {data.runtime} mins</Text>
//             </View>
//             <Text style={styles.overview}>{data.overview}</Text>
//             <Text style={styles.sectionTitle}>Genres:</Text>
//             <View style={styles.genreContainer}>
//               {data.genres &&
//                 data.genres.map(genre => (
//                   <Text key={genre.id} style={styles.genreText}>
//                     {genre.name}
//                   </Text>
//                 ))}
//             </View>
//             <Text style={styles.sectionTitle}>Production Companies:</Text>
//             <View style={styles.productionContainer}>
//               {data.production_companies &&
//                 data.production_companies.map(company => (
//                   <Text key={company.id} style={styles.productionText}>
//                     {company.name}
//                   </Text>
//                 ))}
//             </View>
//             <View style={styles.additionalInfoContainer}>
//               {data.revenue && (
//                 <Text style={styles.additionalInfoText}>
//                   Revenue: ${data.revenue.toLocaleString()}
//                 </Text>
//               )}
//               <Text style={styles.additionalInfoText}>
//                 IMDb Rating: {data.vote_average}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </SafeAreaView>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.BLACK,
//   },
//   marginView: {
//     marginHorizontal: moderateScale(16),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: moderateVerticalScale(16),
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerRight: {
//     flexDirection: 'row',
//     gap: 10,
//     alignItems: 'center',
//   },
//   imageView: {
//     marginBottom: moderateVerticalScale(16),
//   },
//   videoImage: {
//     height: moderateScale(500),
//     width: 'auto',
//     borderRadius: moderateScale(8),
//   },
//   detailsView: {},
//   title: {
//     color: Color.WHITE,
//     fontSize: scale(18),
//     fontWeight: 'bold',
//     marginBottom: moderateVerticalScale(8),
//   },
//   text: {
//     color: Color.WHITE,
//     fontSize: scale(14),
//     marginBottom: moderateVerticalScale(4),
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   infoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: moderateVerticalScale(8),
//   },
//   infoText: {
//     color: Color.WHITE,
//     fontSize: scale(14),
//   },
//   overview: {
//     color: Color.WHITE,
//     fontSize: scale(14),
//     marginBottom: moderateVerticalScale(8),
//   },
//   sectionTitle: {
//     color: Color.WHITE,
//     fontSize: scale(16),
//     fontWeight: 'bold',
//     marginTop: moderateVerticalScale(16),
//   },
//   genreContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: moderateVerticalScale(8),
//   },
//   genreText: {
//     color: Color.WHITE,
//     fontSize: scale(14),
//     marginRight: moderateScale(8),
//   },
//   productionContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: moderateVerticalScale(8),
//   },
//   productionText: {
//     color: Color.WHITE,
//     fontSize: scale(14),
//     marginRight: moderateScale(8),
//   },
//   additionalInfoContainer: {
//     marginTop: moderateVerticalScale(16),
//   },
//   additionalInfoText: {
//     color: Color.WHITE,
//     fontSize: scale(14),
//     marginBottom: moderateVerticalScale(4),
//   },
// });

// export default VideoScreen;

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {fetchMovieDetails, fetchTvDetails, image500} from '../../utils/Movie';
import Color from '../../constants/Color';

const VideoScreen = ({route}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const {itemId} = route.params;

  const isMovie = true;
  useEffect(() => {
    itemId !== null && itemId !== undefined
      ? isMovie
        ? getMovieDetails()
        : getTvDetails()
      : null;
  }, [itemId]);

  const getMovieDetails = async () => {
    try {
      const response = await fetchMovieDetails(itemId);
      setData(response ?? null);
      // console.log('Movie details:', response);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const getTvDetails = async () => {
    try {
      const response = await fetchTvDetails(itemId);
      setData(response ?? null);
      console.log('Movie details:', response);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size={'small'} color={Color.RED} />
      ) : error ? (
        <Text style={{color: Color.WHITE}}>Error: {error}</Text>
      ) : (
        <View style={styles.detailsContainer}>
          <Image
            source={{uri: image500(data?.poster_path)}}
            style={styles.poster}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>
              {data?.title || data?.original_title}
            </Text>
            <Text style={styles.infoText}>
              Release Date: {data?.release_date}
            </Text>
            <Text style={styles.infoText}>Popularity: {data?.popularity}</Text>
            <Text style={styles.infoText}>Runtime: {data?.runtime} mins</Text>
            <Text style={styles.overview}>{data?.overview}</Text>
            <Text style={styles.sectionTitle}>Genres:</Text>
            <View style={styles.genreContainer}>
              {data?.genres?.map(genre => (
                <Text key={genre.id} style={styles.genreText}>
                  {genre.name}
                </Text>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Production Companies:</Text>
            <View style={styles.productionContainer}>
              {data?.production_companies?.map(company => (
                <Text key={company.id} style={styles.productionText}>
                  {company.name}
                </Text>
              ))}
            </View>
            <View style={styles.additionalInfoContainer}>
              {data?.revenue && (
                <Text style={styles.additionalInfoText}>
                  Revenue: ${data?.revenue.toLocaleString()}
                </Text>
              )}
              <Text style={styles.additionalInfoText}>
                IMDb Rating: {data?.vote_average}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Color.WHITE,
    fontSize: 18,
  },
  errorText: {
    color: Color.WHITE,
    fontSize: 18,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 10,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Color.WHITE,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: Color.WHITE,
  },
  overview: {
    fontSize: 16,
    marginBottom: 10,
    color: Color.WHITE,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: Color.WHITE,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  genreText: {
    marginRight: 10,
    marginBottom: 5,
    fontSize: 16,
    color: Color.WHITE,
  },
  productionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  productionText: {
    marginRight: 10,
    marginBottom: 5,
    fontSize: 16,
    color: Color.WHITE,
  },
  additionalInfoContainer: {
    marginTop: 20,
  },
  additionalInfoText: {
    fontSize: 16,
    marginBottom: 5,
    color: Color.WHITE,
  },
});
export default VideoScreen;
