import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {auth} from '../../config/Firebase';
import ImagePicker from 'react-native-image-crop-picker';
import CustomIcon from '../../components/CustomIcon';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import ImagePath from '../../constants/ImagePath';
import navigationString from '../../constants/navigationString';
import {useDispatch} from 'react-redux';
import {
  clearCredentials,
  setEmail,
  setPassword,
} from '../../redux/Slices/authSlice';
import * as Animatable from 'react-native-animatable';

const MoreScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(ImagePath.NETFLIXPROFILE);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          const userData = await firestore()
            .collection('Users')
            .doc(user.uid)
            .get();
          if (userData.exists) {
            const data = userData.data();
            setList([data]);
            const profileImage = data.profileImage;
            if (profileImage) {
              setSelectedImage({uri: profileImage});
            } else {
              setSelectedImage(ImagePath.NETFLIXPROFILE);
            }
          } else {
            // console.error('User data does not exist');
            setSelectedImage(ImagePath.NETFLIXPROFILE);
          }
          setIsLoading(false);
        } catch (error) {
          // console.error('Error fetching user data: ', error);
          setIsLoading(false);
          Alert.alert('Error', 'Failed to fetch user data');
        }
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        openImagePicker('camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission: ', error);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'This app needs access to your gallery.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Gallery permission granted');
        openImagePicker('gallery');
      } else {
        console.log('Gallery permission denied');
      }
    } catch (error) {
      console.error('Error requesting gallery permission: ', error);
    }
  };

  const openImagePicker = async type => {
    try {
      let selectedImage;
      if (type === 'camera') {
        selectedImage = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });
      } else if (type === 'gallery') {
        selectedImage = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          waitAnimationEnd: true,
          useFrontCamera: true,
        });
      }

      setSelectedImage({uri: selectedImage.path});

      const user = auth.currentUser;
      if (user) {
        const profileImageUrl = selectedImage.path;
        await firestore().collection('Users').doc(user.uid).update({
          profileImage: profileImageUrl,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editProfile = () => {
    setModalVisible(true);
  };

  const signOut = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            setIsLoading(true);
            setTimeout(async () => {
              await auth.signOut();
              await AsyncStorage.clear();
              dispatch(clearCredentials());
              dispatch(setEmail(''));
              dispatch(setPassword(''));
              setIsLoading(false);

              navigation.push(navigationString.LOGINSCREEN);
            }, 1000);
          } catch (error) {
            console.error('Error during logout:', error);
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Animatable.View
      animation="fadeIn"
      duration={1000}
      style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Color.RED}
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        />
      ) : (
        <View style={styles.marginContainer}>
          <Animatable.View
            animation="slideInUp"
            duration={1000}
            style={styles.profileContainer}>
            <TouchableOpacity onPress={editProfile}>
              <View style={styles.itemContainer}>
                <Image style={styles.image} source={selectedImage} />
                <Text style={styles.email}>{list[0]?.username}</Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <View style={styles.listItemContainer}>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                navigation.navigate(navigationString.MYLISTSCREEN);
              }}>
              <CustomIcon
                color={Color.WHITE}
                name={'checkmark-sharp'}
                size={scale(34)}
              />
              <Text style={styles.listItemText}>My List</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>App Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                signOut();
              }}>
              <Text style={styles.menuText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <EditProfileModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            requestCameraPermission={requestCameraPermission}
            requestGalleryPermission={requestGalleryPermission}
          />
        </View>
      )}
    </Animatable.View>
  );
};

const EditProfileModal = ({
  modalVisible,
  setModalVisible,
  requestCameraPermission,
  requestGalleryPermission,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setModalVisible(false);
          }}>
          <CustomIcon name="x" size={24} color={Color.WHITE} type="Feather" />
        </TouchableOpacity>
        <Animatable.View
          animation="slideInUp"
          duration={1000}
          style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              setModalVisible(false);
              requestCameraPermission();
            }}>
            <CustomIcon name="camera" size={24} color={Color.WHITE} />
            <Text style={styles.modalItemText}>Get a Camera Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              setModalVisible(false);
              requestGalleryPermission();
            }}>
            <CustomIcon name="images" size={24} color={Color.WHITE} />
            <Text style={styles.modalItemText}>Get image from Gallery</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(30),
  },
  itemContainer: {
    alignItems: 'center',
    marginVertical: moderateVerticalScale(20),
  },
  email: {
    color: Color.WHITE,
    fontSize: moderateScale(24),
    marginVertical: moderateVerticalScale(8),
    fontWeight: '700',
  },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderColor: Color.RED,
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Color.BLACK_70,
    padding: moderateScale(20),
    width: '100%',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(16),
    borderColor: Color.WHITE,
    borderWidth: 1,
    padding: moderateScale(8),
    borderRadius: moderateScale(12),
  },
  modalItemText: {
    color: Color.WHITE,
    marginLeft: moderateScale(10),
  },
  closeButton: {
    position: 'absolute',
    top: moderateVerticalScale(20),
    right: moderateScale(20),
    zIndex: 1,
  },
  listItemContainer: {
    padding: moderateScale(8),
    borderBottomColor: Color.WHITE,
    borderBottomWidth: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    color: Color.WHITE,
    marginLeft: moderateScale(24),
    fontSize: scale(22),
  },
  menuText: {
    color: Color.WHITE,
    marginLeft: moderateScale(24),
    fontSize: scale(18),
    fontWeight: '600',
  },
  menuItem: {
    marginVertical: moderateVerticalScale(8),
  },
});

export default MoreScreen;
