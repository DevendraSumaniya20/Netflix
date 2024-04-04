import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationString from '../constants/navigationString';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
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
          name={navigationString.HOMESCREEN}
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
