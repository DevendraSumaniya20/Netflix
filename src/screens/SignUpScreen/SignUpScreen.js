import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import Color from '../../constants/Color';
import navigationString from '../../constants/navigationString';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({navigation}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
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

    setTimeout(() => {
      if (!emailError && !passwordError) {
        handleSignUp();
      }
    }, 0); // This ensures that state is updated before executing handleSignUp
  }, [email, password, emailError, passwordError]);

  const handleSignUp = useCallback(async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      ); // Fix here
      console.log('User signed up successfully:', userCredential.user.uid);
      navigation.navigate(navigationString.HOMESCREEN);
    } catch (error) {
      console.error('Error signing up user:', error.message);
    }
  }, [email, password, navigation]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.BLACK,
  },
  innerContainerStyle: {
    backgroundColor: Color.BLACK_50,
    alignItems: 'center',
    borderRadius: moderateScale(50),
    width: moderateScale(370),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(16),
  },
  title: {
    color: Color.WHITE,
    fontSize: moderateScale(26),
    marginBottom: moderateVerticalScale(16),
    marginTop: moderateVerticalScale(8),
    alignSelf: 'flex-start',
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
});
