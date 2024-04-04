import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CustomTheme from '../constants/CustomTheme';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomIcon from './CustomIcon';
import Color from '../constants/Color';

const CustomTextInput = ({
  placeholder = '',
  inputStyle = {},
  onChangeText = () => {},
  secureTextEntry,
  onPressRight,
  rightIcon,
  autoFocus,
  placeholderTextColor,
}) => {
  return (
    <View style={[styles.textInput, {borderColor: Color.WHITE}]}>
      <TextInput
        placeholder={placeholder}
        style={[
          styles.inputStyle,
          inputStyle,
          {color: Color.WHITE, fontWeight: '500'},
        ]}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        placeholderTextColor={placeholderTextColor}
      />
      {!!rightIcon && (
        <TouchableOpacity
          onPress={onPressRight}
          style={styles.rightIconContainer}>
          <CustomIcon name={rightIcon} size={20} color={Color.WHITE} />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default CustomTextInput;

const styles = StyleSheet.create({
  inputStyle: {
    padding: moderateScale(12),
    fontSize: scale(14),
    height: moderateScale(52),
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 21,
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    // borderWidth: 1,
    justifyContent: 'space-between',
    textAlign: 'left',
  },
  rightIconContainer: {
    marginRight: moderateScale(12),
    alignItems: 'center',
  },
});
