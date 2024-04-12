import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Color from '../../constants/Color';
import ImagePath from '../../constants/ImagePath';
import CustomIconText from '../../components/CustomIconText';
import CustomTrendingMovies from '../../components/Movie/CustomTrendingMovies';
import CustomTrandingTvShow from '../../components/Tv/CustomTrandingTvShow';
import CustomTopRatedMovies from '../../components/Movie/CustomTopRatedMovies';
import CustomTopRatedTvShows from '../../components/Tv/CustomTopRatedTvShows';
import CustomNowPlayingMovies from '../../components/Movie/CustomNowPlayingMovies';
import CustomPopularMovies from '../../components/Movie/CustomPopularMovies';
import navigationString from '../../constants/navigationString';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import styles from './Styles';

const HomeScreen = ({navigation, route}) => {
  return (
    <>
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic">
        <View style={{flex: 1, backgroundColor: Color.BLACK}}>
          <SafeAreaView style={styles.container}>
            <View style={styles.backgroundContainer}>
              <ImageBackground
                source={ImagePath.DEMOIMAGE}
                style={styles.backgroundImage}>
                <View style={styles.topView}>
                  <Image source={ImagePath.SYMBOL} style={styles.logo} />
                  <TouchableOpacity activeOpacity={0.5}>
                    <Text style={styles.topViewTextStyle}>TV Shows</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5}>
                    <Text style={styles.topViewTextStyle}>Movies</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5}>
                    <Text style={styles.topViewTextStyle}>My List</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.downView}>
                  <Text style={styles.downViewTextStyle}>Movies name</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.marginView}>
              <View style={styles.centerView}>
                <CustomIconText
                  color={'#fff'}
                  text={'My list'}
                  iconName={'plus'}
                  type={'AntDesign'}
                  onPress={() => {
                    Alert.alert('hello');
                  }}
                  size={scale(25)}
                />
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
                    backgroundColor: Color.GRAY_2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: moderateScale(5),
                    paddingHorizontal: moderateScale(30),
                    height: moderateVerticalScale(48),
                  }}
                  moreTextStyle={{
                    color: Color.BLACK,
                    fontWeight: '600',
                    fontSize: scale(20),
                  }}
                />
                <CustomIconText
                  color={'#fff'}
                  text={'info'}
                  iconName={'information-circle-sharp'}
                  type={'Ionicons'}
                  onPress={() => {
                    Alert.alert('hello');
                  }}
                  size={scale(25)}
                />
              </View>
              <View style={styles.secondMainView}>
                <Text style={styles.mainHeader}>Now Playing</Text>
                <CustomNowPlayingMovies
                  onPress={item => {
                    navigation.navigate(navigationString.VIDEOSCREEN, {
                      itemIdMovie: item.id,
                    });
                  }}
                />
                <Text style={styles.mainHeader}>Trending Movies</Text>
                <CustomTrendingMovies
                  onPress={item => {
                    navigation.navigate(navigationString.VIDEOSCREEN, {
                      itemIdMovie: item.id,
                    });
                  }}
                />
                <Text style={styles.mainHeader}>Trending TvShows</Text>
                <CustomTrandingTvShow
                  onPress={item => {
                    navigation.navigate(navigationString.VIDEOSCREEN, {
                      itemIdTv: item.id,
                    });
                  }}
                />
                <Text style={styles.mainHeader}>Top Rated Movie</Text>
                <CustomTopRatedMovies
                  onPress={item => {
                    navigation.navigate(navigationString.VIDEOSCREEN, {
                      itemIdMovie: item.id,
                    });
                  }}
                />
                <Text style={styles.mainHeader}>Top Rated TvShows</Text>
                <CustomTopRatedTvShows
                  onPress={item => {
                    navigation.navigate(navigationString.VIDEOSCREEN, {
                      itemIdTv: item.id,
                    });
                  }}
                />
                <Text style={styles.mainHeader}>Most Popular</Text>
                <CustomPopularMovies
                  onPress={item => {
                    navigation.navigate(navigationString.VIDEOSCREEN, {
                      itemIdMovie: item.id,
                    });
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;
