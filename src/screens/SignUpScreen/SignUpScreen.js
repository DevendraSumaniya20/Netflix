import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import Color from '../../constants/Color';
import {createUserWithEmailAndPassword} from '@firebase/auth';
import {auth} from '../../config/Firebase';
import navigationString from '../../constants/navigationString';
import styles from './Styles';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({navigation}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = useCallback(text => {
    setEmail(text);
    setEmailError('');
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
    setPasswordError('');
  }, []);

  useEffect(() => {
    checkTokens();
  }, []);

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

  const validateInputs = useCallback(() => {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailMaxLength = 50;
    const passwordMaxLength = 30;

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
      handleSignUp();
    }
  }, [email, password, emailError, passwordError, handleSignUp]);

  const handleSignUp = useCallback(async () => {
    if (emailError || passwordError) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('User signed up successfully:', userCredential.user);

      const idToken = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('idToken', idToken);
      await AsyncStorage.setItem('accessToken', idToken);

      const newUserRef = await firestore().collection('Users').add({
        email: email,
        password: password,
      });
      console.log('User added to Firestore:', newUserRef.id);

      console.log('Access token set successfully.');
      navigation.navigate(navigationString.BOTTOMTABNAVIGATION);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }, [email, password, emailError, passwordError, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainerStyle}>
        <Text style={styles.title}>Sign Up</Text>
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
            inputStyle={{
              color: Color.WHITE,
              width: '90%',
            }}
            rightIcon={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
            onPressRight={() => setSecureTextEntry(!secureTextEntry)}
            secureTextEntry={secureTextEntry}
            rightIconStyle={{color: Color.WHITE}}
          />
        </View>
        <Text style={styles.errorText}>{passwordError}</Text>
        <CustomButton
          text="Sign Up"
          onPress={validateInputs}
          inlineStyle={{backgroundColor: Color.RED}}
          textStyle={{color: Color.WHITE}}
        />
      </View>
    </View>
  );
};

export default SignUpScreen;
