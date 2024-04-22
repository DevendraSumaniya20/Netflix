import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomIcon from './CustomIcon';
import Color from '../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

const CustomSearch = ({
  placeholder,
  placeholderTextColor,
  onChangeText,
  iconName,
  size,
  type,
  iconColor,
  iconName2,
  type2,
  iconColor2,
  textInputStyle,
  value,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <CustomIcon name={iconName} color={iconColor} size={size} type={type} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          style={[styles.textInput, textInputStyle]}
          value={value}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          autoFocus={false}
        />
        <CustomIcon
          name={iconName2}
          color={iconColor2}
          size={size}
          type={type2}
        />
      </View>
    </View>
  );
};

export default CustomSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.GRAY,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: moderateVerticalScale(6),
  },
  textInput: {
    flex: 1,
    color: Color.WHITE,
    fontSize: scale(14),
    marginLeft: moderateScale(8),
  },
});
