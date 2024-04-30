import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ImagePath from '../../constants/ImagePath';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import Color from '../../constants/Color';
import CustomBorderComponent from '../../components/CustomBorderComponent';
import navigationString from '../../constants/navigationString';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signInWithEmailAndPassword} from 'firebase/auth';
import styles from './Styles';
import {auth} from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const LoginScreen = ({navigation}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(100);

  const handleEmailChange = useCallback(text => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
  }, []);

  useEffect(() => {
    checkTokens();
    opacity.value = withTiming(1, {duration: 500});
    translateY.value = withTiming(0, {duration: 500, easing: Easing.ease});
  }, []);

  const validateInputs = useCallback(() => {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailMaxLength = 50;
    const passwordMaxLength = 30;

    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Please enter Email Address');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid Email Address');
    } else if (email.length > emailMaxLength) {
      setEmailError(
        `Email Address must be less than ${emailMaxLength} characters`,
      );
    }

    if (!password) {
      setPasswordError('Please enter Password');
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character',
      );
    } else if (password.length > passwordMaxLength) {
      setPasswordError(
        `Password must be less than ${passwordMaxLength} characters`,
      );
    }

    if (!emailError && !passwordError) {
      handleSignIn();
    }
  }, [email, password, emailError, passwordError, handleSignIn]);

  const checkTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (accessToken) {
        navigation.navigate(navigationString.BOTTOMTABNAVIGATION);
      } else {
        console.log('Access Token not found. Navigating to LoginScreen...');
        navigation.navigate(navigationString.LOGINSCREEN);
      }
    } catch (error) {
      console.error('Error checking tokens:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userRef = firestore().collection('Users').doc(user.uid);

      const userSnapshot = await userRef.get();

      // if (userSnapshot.exists) {
      //   setLoading(false);
      //   console.error('Sign-in error: Email is already in use');
      //   return;
      // }

      const idToken = await user.getIdToken();
      await AsyncStorage.setItem('idToken', idToken);
      await AsyncStorage.setItem('accessToken', idToken);

      const userId = uuid.v4();

      const username = email.split('@')[0];

      await userRef.set({
        userId: userId,
        email: user.email,
        username: username,
      });

      navigation.navigate(navigationString.BOTTOMTABNAVIGATION, {
        screen: navigationString.HOMESCREEN,
      });
    } catch (error) {
      const errorMessage = error.message;
      console.error('Sign-in error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = () => setChecked(!checked);

  return (
    <ImageBackground
      source={ImagePath.BACKGROUND}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacity,
            transform: [{translateY: translateY}],
          },
        ]}>
        <View style={styles.innerContainerStyle}>
          <Text
            style={{
              color: Color.WHITE,
              fontSize: scale(26),
              marginBottom: moderateVerticalScale(16),
              marginTop: moderateVerticalScale(8),
              alignSelf: 'flex-start',
            }}>
            Sign In
          </Text>
          <View style={styles.inputContainerStyle}>
            <CustomTextInput
              placeholder="Email"
              placeholderTextColor={Color.WHITE}
              value={email}
              onChangeText={handleEmailChange}
            />
          </View>
          <Text style={styles.errorText}>{emailError}</Text>
          <View style={styles.inputContainerStyle}>
            <CustomTextInput
              onChangeText={handlePasswordChange}
              placeholder="Password"
              placeholderTextColor={Color.WHITE}
              inputStyle={{color: Color.WHITE, width: '90%'}}
              rightIcon={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              onPressRight={() => setSecureTextEntry(!secureTextEntry)}
              secureTextEntry={secureTextEntry}
              rightIconStyle={{color: Color.WHITE}}
            />
          </View>
          <Text style={styles.errorText}>{passwordError}</Text>
          {loading ? (
            <ActivityIndicator size="large" color={Color.WHITE} />
          ) : (
            <CustomButton
              text="Sign in"
              onPress={validateInputs}
              inlineStyle={{backgroundColor: Color.RED}}
              textStyle={{color: Color.WHITE}}
            />
          )}

          <Text style={styles.orStyleText}>OR</Text>
          <CustomBorderComponent
            text={'Use a sign-in code'}
            inLineTextStyle={{color: Color.WHITE}}
            inLineStyle={{
              backgroundColor: Color.GRAY,
              marginBottom: moderateVerticalScale(8),
            }}
          />
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: moderateVerticalScale(16),
              marginTop: moderateVerticalScale(8),
            }}>
            <Text style={styles.forgotpasswordTextStyle}>Forgot Password?</Text>
          </TouchableOpacity>
          <View
            style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              marginBottom: moderateVerticalScale(8),
            }}>
            <Text style={{color: Color.WHITE, fontSize: scale(16)}}>
              New to Netflix?{' '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationString.SIGNUPSCREEN)
              }>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  textDecorationColor: Color.WHITE,
                  textDecorationStyle: 'solid',
                  color: Color.WHITE,
                  fontSize: scale(18),
                  fontWeight: '700',
                }}>
                Sign up now
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignSelf: 'center',
            }}>
            <Text style={{color: Color.WHITE, fontSize: scale(14)}}>
              This page is protected by Google reCAPTCHA to
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: Color.WHITE, fontSize: scale(14)}}>
                ensure you're not a bot.{' '}
              </Text>
              <Text style={{color: '#0071EB', fontSize: scale(14)}}>
                Learn more.
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default LoginScreen;
