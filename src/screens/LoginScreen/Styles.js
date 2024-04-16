import {StyleSheet} from 'react-native';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

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
    marginBottom: moderateVerticalScale(8),
  },
  errorText: {
    color: 'red',
    fontSize: scale(12),
    alignSelf: 'flex-start',
    marginLeft: moderateScale(4),
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

export default styles;
