import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import ImagePath from '../../constants/ImagePath';
import Color from '../../constants/Color';
import CustomIconText from '../../components/CustomIconText';

const HomeScreen = () => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundContainer}>
          <ImageBackground
            source={ImagePath.DEMOIMAGE}
            style={styles.backgroundImage}>
            <View style={styles.topView}>
              <Image source={ImagePath.SYMBOL} style={styles.logo} />
              <Text style={styles.topViewTextStyle}>TV Shows</Text>
              <Text style={styles.topViewTextStyle}>Movies</Text>
              <Text style={styles.topViewTextStyle}>My List</Text>
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
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    shadowColor: Color.RED,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  backgroundImage: {
    height: moderateScale(500),
    width: 'auto',
    elevation: 8,
  },
  marginView: {
    marginHorizontal: moderateScale(16),
  },
  logo: {
    marginTop: moderateScale(8),
    height: moderateScale(40),
    width: moderateScale(40),
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
  },
  topViewTextStyle: {
    color: '#fff',
    fontSize: scale(16),
  },
  downView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  downViewTextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: scale(16),
  },
  centerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
