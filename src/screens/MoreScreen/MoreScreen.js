import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {auth} from '../../config/Firebase';
import ImagePicker from 'react-native-image-crop-picker';
import CustomIcon from '../../components/CustomIcon';
import Color from '../../constants/Color';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import ImagePath from '../../constants/ImagePath';

const MoreScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(ImagePath.NETFLIXPROFILE);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          const userData = await firestore()
            .collection('Users')
            .doc(user.uid)
            .get();
          const data = userData.data();
          setList([data]);

          const profileImage = data.profileImage;
          if (profileImage) {
            setSelectedImage({uri: profileImage});
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching user data: ', error);
          setIsLoading(false);
        }
      } else {
        console.error('No user found');
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
      setIsEditingImage(true);
    } catch (error) {
      console.error(error);
    }
  };

  const editProfile = () => {
    setModalVisible(true);
  };

  const keyExtractor = (item, index) => index.toString();

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Color.RED} />
      ) : (
        <View>
          <FlatList
            data={list}
            keyExtractor={keyExtractor}
            renderItem={({item}) => (
              <TouchableOpacity onPress={editProfile}>
                <View style={styles.itemContainer}>
                  {selectedImage.uri ? (
                    <Image style={styles.image} source={selectedImage} />
                  ) : (
                    <Image
                      style={styles.image}
                      source={ImagePath.NETFLIXPROFILE}
                    />
                  )}
                  <Text style={styles.email}>{item.username}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.editButton} onPress={editProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <EditProfileModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        requestCameraPermission={requestCameraPermission}
        requestGalleryPermission={requestGalleryPermission}
      />
    </View>
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
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              setModalVisible(false);
              requestCameraPermission();
            }}>
            <CustomIcon name="camera" size={24} color={Color.WHITE} />
            <Text style={{color: Color.WHITE}}>Get a Camera Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              setModalVisible(false);
              requestGalleryPermission();
            }}>
            <CustomIcon name="images" size={24} color={Color.WHITE} />
            <Text style={{color: Color.WHITE}}>Get image from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  itemContainer: {},
  email: {
    color: Color.WHITE,
    fontSize: moderateScale(16),
  },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Color.BLACK,
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
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateVerticalScale(8),
    borderRadius: moderateScale(20),
    gap: 10,
  },
  closeButton: {
    position: 'absolute',
    top: moderateVerticalScale(550),
    right: moderateScale(20),
    zIndex: 1,
  },
  editButton: {
    position: 'absolute',
    bottom: moderateVerticalScale(20),
    right: moderateScale(20),
    backgroundColor: Color.RED,
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  editButtonText: {
    color: Color.WHITE,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

export default MoreScreen;
