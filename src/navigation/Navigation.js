import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationString from '../constants/navigationString';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen/ForgotPasswordScreen';
import BottomTabNavigation from './BottomTabNavigation';
import VideoScreen from '../screens/VideoScreen/VideoScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name={navigationString.LOGINSCREEN}
          component={LoginScreen}
        />
        <Stack.Screen
          name={navigationString.SIGNUPSCREEN}
          component={SignUpScreen}
        />
        <Stack.Screen
          name={navigationString.FORGOTPASSWORDSCREEN}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={navigationString.BOTTOMTABNAVIGATION}
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={navigationString.VIDEOSCREEN}
          component={VideoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
