import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomIcon from './CustomIcon';
import {moderateVerticalScale, scale} from 'react-native-size-matters';
import Color from '../constants/Color';

const CustomIconText = ({
  iconName,
  text,
  onPress,
  color,
  type,
  size,
  flexDirection,
  moreStyles,
  moreTextStyle,
}) => {
  return (
    <View style={[styles.container, {flexDirection: flexDirection}]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.touchableOpacityStyle,
          moreStyles,
          {flexDirection: flexDirection},
        ]}>
        <CustomIcon name={iconName} color={color} type={type} size={size} />
        <Text style={[styles.textStyle, moreTextStyle]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomIconText;

const styles = StyleSheet.create({
  container: {},
  touchableOpacityStyle: {
    marginVertical: moderateVerticalScale(8),
  },
  textStyle: {
    fontSize: scale(14),
    color: Color.WHITE,
    fontWeight: '400',
  },
});
