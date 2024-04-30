import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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
import {auth} from '../../config/Firebase';
import * as Animatable from 'react-native-animatable';

const MyListScreen = ({navigation, route}) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        firestore()
          .collection('myList')
          .where('userId', '==', user.uid)
          .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            setIsLoading(false);
            setList(data);
          });
      } else {
        console.error('No authenticated user found');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const navigateToVideoScreen = item => {
    navigation.navigate(navigationString.VIDEOSCREEN, {myListItem: item});
  };

  const renderItem = ({item, index}) => (
    <Animatable.View animation="fadeInDown" delay={index * 100} duration={1000}>
      <TouchableOpacity onPress={() => navigateToVideoScreen(item)}>
        <View style={styles.viewpic}>
          <Image
            source={{uri: image342(item.itemImage)}}
            style={styles.image}
            resizeMethod="auto"
            resizeMode="contain"
          />
          {/* <Text style={styles.title}>{item.title}</Text> */}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.marginContainer}>
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
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Color.RED}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            />
          ) : (
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={{flex: 1}}
              contentContainerStyle={styles.flatListContainer}
              numColumns={3}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },

  marginContainer: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateVerticalScale(4),
    flex: 1,
  },
  image: {
    height: moderateVerticalScale(115),
    width: moderateScale(100),
    marginHorizontal: moderateScale(6),
    marginBottom: moderateScale(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: Color.WHITE,
  },
  contentContainer: {
    flex: 1,
  },
  flatListContainer: {
    marginTop: moderateVerticalScale(8),
  },

  title: {
    fontSize: scale(18),
    marginTop: moderateVerticalScale(10),
    textAlign: 'center',
    color: Color.WHITE,
  },
});

export default MyListScreen;
