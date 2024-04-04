import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
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

const LoginScreen = ({navigation}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);

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
              inputStyle={{}}
            />
          </View>
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

          <CustomButton
            text="Sign in"
            onPress={() => {}}
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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                toggleCheckbox();
              }}>
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
              onPress={() => {
                navigation.navigate(navigationString.SIGNUPSCREEN);
              }}>
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
                ensure you're not a bot.
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
    marginBottom: moderateVerticalScale(16),
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
