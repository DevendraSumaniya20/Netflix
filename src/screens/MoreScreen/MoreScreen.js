import React, {useEffect, useState, useCallback, useMemo} from 'react';
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
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
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

const MenuItem = ({icon, iconType, title, onPress, hasChevron = true}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemContent}>
      <View style={styles.menuItemIconContainer}>
        <CustomIcon
          name={icon}
          size={scale(22)}
          color={Color.WHITE}
          type={iconType}
        />
      </View>
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    {hasChevron && (
      <CustomIcon
        name="chevron-right"
        size={scale(20)}
        color={Color.WHITE_70}
        type="Feather"
      />
    )}
  </TouchableOpacity>
);

const SectionTitle = ({title}) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const Divider = () => <View style={styles.divider} />;

const ProfileHeader = ({user, selectedImage, onEditPress}) => (
  <Animatable.View
    animation="fadeIn"
    duration={800}
    style={styles.profileContainer}>
    <TouchableOpacity onPress={onEditPress}>
      <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={selectedImage} />
        <View style={styles.editIconContainer}>
          <CustomIcon
            name="edit-2"
            size={scale(14)}
            color={Color.WHITE}
            type="Feather"
          />
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
    </TouchableOpacity>
  </Animatable.View>
);

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
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayArea}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
        </View>

        <Animatable.View
          animation="slideInUp"
          duration={300}
          style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <CustomIcon
                name="x"
                size={scale(20)}
                color={Color.WHITE}
                type="Feather"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalOptions}>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setModalVisible(false);
                requestCameraPermission();
              }}>
              <View style={styles.modalItemIconContainer}>
                <CustomIcon
                  name="camera"
                  size={scale(22)}
                  color={Color.RED}
                  type="Feather"
                />
              </View>
              <Text style={styles.modalItemText}>Take a Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setModalVisible(false);
                requestGalleryPermission();
              }}>
              <View style={styles.modalItemIconContainer}>
                <CustomIcon
                  name="image"
                  size={scale(22)}
                  color={Color.RED}
                  type="Feather"
                />
              </View>
              <Text style={styles.modalItemText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const MoreScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(ImagePath.NETFLIXPROFILE);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async user => {
      try {
        const userDoc = await firestore()
          .collection('Users')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();
          setUserData(data);

          if (data.profileImage) {
            setSelectedImage({uri: data.profileImage});
          } else {
            setSelectedImage(ImagePath.NETFLIXPROFILE);
          }
        } else {
          setSelectedImage(ImagePath.NETFLIXPROFILE);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data');
        console.log('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUserData(user);
      } else {
        setIsLoading(false);
        navigation.replace(navigationString.LOGINSCREEN);
      }
    });

    return () => unsubscribeAuth();
  }, [navigation]);

  const requestPermission = useCallback(async type => {
    if (Platform.OS !== 'android') {
      openImagePicker(type);
      return;
    }

    try {
      const permission =
        type === 'camera'
          ? PermissionsAndroid.PERMISSIONS.CAMERA
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const permissionTitle =
        type === 'camera' ? 'Camera Permission' : 'Gallery Permission';
      const permissionMessage = `This app needs access to your ${type === 'camera' ? 'camera' : 'gallery'}.`;

      const granted = await PermissionsAndroid.request(permission, {
        title: permissionTitle,
        message: permissionMessage,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openImagePicker(type);
      }
    } catch (error) {
      console.log(`Error requesting ${type} permission:`, error);
    }
  }, []);

  const requestCameraPermission = useCallback(
    () => requestPermission('camera'),
    [requestPermission],
  );
  const requestGalleryPermission = useCallback(
    () => requestPermission('gallery'),
    [requestPermission],
  );

  const openImagePicker = async type => {
    try {
      let image;
      const options = {
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      };

      if (type === 'camera') {
        image = await ImagePicker.openCamera(options);
      } else {
        image = await ImagePicker.openPicker(options);
      }

      if (image?.path) {
        setSelectedImage({uri: image.path});
        updateUserProfileImage(image.path);
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.log('Error picking image:', error);
      }
    }
  };

  const updateUserProfileImage = async imageUri => {
    const user = auth.currentUser;
    if (!user) return;

    setIsLoading(true);
    try {
      await firestore().collection('Users').doc(user.uid).update({
        profileImage: imageUri,
      });

      // Update local state
      if (userData) {
        setUserData({...userData, profileImage: imageUri});
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile image');
      console.log('Error updating profile image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await auth.signOut();
              await AsyncStorage.clear();
              dispatch(clearCredentials());
              dispatch(setEmail(''));
              dispatch(setPassword(''));
              navigation.replace(navigationString.LOGINSCREEN);
            } catch (error) {
              console.log('Error during logout:', error);
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const menuItems = useMemo(
    () => [
      {
        section: 'Content',
        items: [
          {
            icon: 'checkmark-circle',
            iconType: 'Ionicons',
            title: 'My List',
            onPress: () => navigation.navigate(navigationString.MYLISTSCREEN),
          },
          {
            icon: 'download',
            iconType: 'Feather',
            title: 'Downloads',
            onPress: () => navigation.navigate(navigationString.DOWNLOADSCREEN),
          },
        ],
      },

      {
        section: 'Account',
        items: [
          {
            icon: 'help-circle',
            iconType: 'Feather',
            title: 'Help & Support',
            onPress: () => navigation.navigate(navigationString.HELP_SUPPORT),
          },
          {
            icon: 'log-out',
            iconType: 'Feather',
            title: 'Sign Out',
            onPress: signOut,
            hasChevron: false,
          },
        ],
      },
    ],
    [navigation, signOut],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Color.BLACK} />
        <ActivityIndicator size="large" color={Color.RED} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Color.BLACK} />

      <Animatable.View
        animation="fadeIn"
        duration={500}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <ProfileHeader
            user={userData}
            selectedImage={selectedImage}
            onEditPress={() => setModalVisible(true)}
          />

          <Divider />

          {menuItems.map((section, sectionIndex) => (
            <Animatable.View
              key={`section-${sectionIndex}`}
              animation="fadeInUp"
              delay={300 + sectionIndex * 100}
              duration={500}>
              <SectionTitle title={section.section} />

              {section.items.map((item, itemIndex) => (
                <MenuItem
                  key={`${section.section}-${itemIndex}`}
                  icon={item.icon}
                  iconType={item.iconType}
                  title={item.title}
                  onPress={item.onPress}
                  hasChevron={item.hasChevron !== false}
                />
              ))}

              {sectionIndex < menuItems.length - 1 && <Divider />}
            </Animatable.View>
          ))}

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>

        <EditProfileModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          requestCameraPermission={requestCameraPermission}
          requestGalleryPermission={requestGalleryPermission}
        />
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  scrollContent: {
    paddingBottom: moderateVerticalScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.BLACK,
  },
  profileContainer: {
    paddingVertical: moderateVerticalScale(24),
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(12),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderWidth: 1,
    borderColor: Color.RED,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Color.RED,
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: moderateVerticalScale(8),
  },
  username: {
    color: Color.WHITE,
    fontSize: moderateScale(24),
    fontWeight: '700',
  },
  email: {
    color: Color.WHITE_70,
    fontSize: moderateScale(14),
    marginTop: moderateVerticalScale(4),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Color.WHITE_30,
    marginVertical: moderateVerticalScale(8),
    marginHorizontal: moderateScale(16),
  },
  sectionTitle: {
    color: Color.WHITE_70,
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginTop: moderateVerticalScale(16),
    marginBottom: moderateVerticalScale(8),
    paddingHorizontal: moderateScale(16),
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(16),
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: Color.BLACK_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    color: Color.WHITE,
    fontSize: moderateScale(16),
    marginLeft: moderateScale(12),
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: moderateVerticalScale(30),
    marginBottom: moderateVerticalScale(10),
  },
  versionText: {
    color: Color.WHITE_50,
    fontSize: moderateScale(12),
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlayArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: Color.BLACK_DARK,
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    paddingVertical: moderateVerticalScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateVerticalScale(16),
  },
  modalTitle: {
    color: Color.WHITE,
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  closeButton: {
    padding: moderateScale(4),
  },
  modalOptions: {
    paddingHorizontal: moderateScale(16),
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(12),
    borderRadius: moderateScale(8),
    marginBottom: moderateVerticalScale(12),
    backgroundColor: Color.BLACK_LIGHT,
    paddingHorizontal: moderateScale(16),
  },
  modalItemIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItemText: {
    color: Color.WHITE,
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginLeft: moderateScale(12),
  },
});

export default MoreScreen;
