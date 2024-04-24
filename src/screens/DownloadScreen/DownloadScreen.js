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

const DownloadScreen = ({route, navigation}) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        firestore()
          .collection('myDownloads')
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

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => navigateToVideoScreen(item)}>
      <View style={styles.renderItemView}>
        <Image
          source={{uri: image342(item.itemImage)}}
          style={styles.image}
          resizeMethod="auto"
          resizeMode="contain"
        />
        <Text style={styles.title}>{item.title}</Text>
        <CustomIcon
          color={Color.WHITE}
          name={'chevron-right'}
          size={scale(24)}
          type="Feather"
        />
      </View>
    </TouchableOpacity>
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
          <Text style={styles.heading}>My Downloads</Text>
          <View style={{width: moderateScale(24)}} />
        </View>
        <View style={styles.contentContainer}>
          {list.length === 0 ? (
            isLoading ? (
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
              <Text style={styles.emptyListMessage}>
                You need to add some downloads in order to see them here.
              </Text>
            )
          ) : (
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={{flex: 1}}
              contentContainerStyle={styles.flatListContainer}
              numColumns={1}
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
    borderRadius: moderateScale(16),
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
    paddingBottom: moderateVerticalScale(150),
  },
  renderItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginBottom: moderateVerticalScale(10),
  },
  title: {
    fontSize: scale(18),
    marginTop: moderateVerticalScale(10),
    textAlign: 'center',
    color: Color.WHITE,
  },
  emptyListMessage: {
    fontSize: scale(16),
    marginTop: moderateVerticalScale(20),
    textAlign: 'center',
    color: Color.WHITE,
  },
});

export default DownloadScreen;
