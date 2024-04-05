import {
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
import {CheckBox} from '@rneui/themed';
import navigationString from '../../constants/navigationString';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../config/Firebase';

const LoginScreen = ({navigation}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = useCallback(text => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
  }, []);

  useEffect(() => {
    checkTokens();
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
      console.log('Access Token:', accessToken);

      if (accessToken) {
        console.log('Navigating to HomeScreen...');
        navigation.navigate(navigationString.HOMESCREEN);
      } else {
        console.log('Access Token not found.');
      }
    } catch (error) {
      console.error('Error checking tokens:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log('User signed in:', user);

      const idToken = await user.getIdToken();
      console.log('ID token:', idToken);

      await AsyncStorage.setItem('idToken', idToken);
      await AsyncStorage.setItem('accessToken', idToken);

      console.log('Access token set successfully.');

      navigation.navigate(navigationString.HOMESCREEN);
    } catch (error) {
      const errorMessage = error.message;
      console.error('Sign-in error:', errorMessage);
    }
  };

  const toggleCheckbox = () => setChecked(!checked);

  return (
    <ImageBackground
      source={ImagePath.BACKGROUND}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.container}>
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
          <CustomButton
            text="Sign in"
            onPress={validateInputs}
            inlineStyle={{backgroundColor: Color.RED}}
            textStyle={{color: Color.WHITE}}
          />
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
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: moderateVerticalScale(8),
              alignSelf: 'flex-start',
            }}>
            <CheckBox
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
                padding: 0,
              }}
              checked={checked}
              checkedColor={Color.WHITE}
              onPress={toggleCheckbox}
              size={26}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={toggleCheckbox}>
              <Text style={{color: Color.WHITE, fontSize: scale(16)}}>
                Remember me
              </Text>
            </TouchableOpacity>
          </View>
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
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainerStyle: {
    backgroundColor: Color.BLACK_50,
    alignItems: 'center',
    borderRadius: moderateScale(18),
    width: moderateScale(370),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(16),
  },
  inputContainerStyle: {
    width: moderateScale(343),
    borderColor: Color.WHITE,
    borderWidth: 1,
    borderRadius: moderateScale(12),
    marginBottom: moderateVerticalScale(8),
  },
  errorText: {
    color: 'red',
    fontSize: scale(12),
    alignSelf: 'flex-start',
    marginLeft: moderateScale(4),
  },
  orStyleText: {
    fontSize: scale(16),
    color: Color.WHITE,
    fontWeight: '500',
    marginBottom: moderateVerticalScale(4),
  },
  forgotpasswordTextStyle: {
    fontSize: scale(16),
    fontWeight: '400',
    color: Color.WHITE,
  },
});
