import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Color from '../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

const CustomBorderComponent = ({
  text,
  onPress,
  inLineStyle,
  inLineTextStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.customBorderComponentView,
        inLineStyle,
        {borderColor: Color.WHITE},
      ]}
      onPress={onPress}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={[
            styles.customBorderComponentText,
            inLineTextStyle,
            {color: Color.WHITE},
          ]}>
          {text}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default CustomBorderComponent;

const styles = StyleSheet.create({
  customBorderComponentView: {
    width: moderateScale(343),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    marginVertical: moderateScale(16),
  },
  customBorderComponentText: {
    fontSize: scale(16),
    fontWeight: '600',
  },
});
