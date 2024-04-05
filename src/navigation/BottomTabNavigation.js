import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import navigationString from '../constants/navigationString';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import CommingSoonScreen from '../screens/CommingSoonScreen/CommingSoonScreen';
import DownloadScreen from '../screens/DownloadScreen/DownloadScreen';
import MoreScreen from '../screens/MoreScreen/MoreScreen';
import Color from '../constants/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {moderateVerticalScale, scale} from 'react-native-size-matters';

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={navigationString.HOMESCREEN}
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" color={color} size={24} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name={navigationString.SEARCHSCREEN}
        component={SearchScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="search" color={color} size={24} />
          ),
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name={navigationString.COMMINGSOONSCREEN}
        component={CommingSoonScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="ondemand-video" color={color} size={24} />
          ),
          tabBarLabel: 'Coming Soon',
        }}
      />
      <Tab.Screen
        name={navigationString.DOWNLOADSCREEN}
        component={DownloadScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Octicons name="download" color={color} size={24} />
          ),
          tabBarLabel: 'Downloads',
        }}
      />
      <Tab.Screen
        name={navigationString.MORESCREEN}
        component={MoreScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="menu" color={color} size={24} />
          ),
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
