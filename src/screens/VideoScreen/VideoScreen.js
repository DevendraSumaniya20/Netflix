import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const VideoScreen = ({navigation, route}) => {
  const {item} = route.params;
  console.log(item);
  return (
    <View>
      <Text>VideoScreen</Text>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({});
