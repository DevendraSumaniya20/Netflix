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
import {auth} from '../../config/Firebase';

const MyListScreen = ({navigation, route}) => {
  const [list, setList] = useState([]);

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

            console.log(data);
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

  const renderItem = ({item}) => (
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
        {list.length === 0 ? (
          <Text style={styles.emptyListMessage}>
            Please add some data to the list first.
          </Text>
        ) : (
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingHorizontal: moderateScale(16),
              paddingTop: moderateVerticalScale(16),
            }}
          />
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
