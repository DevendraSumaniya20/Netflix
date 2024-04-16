import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import Color from '../../constants/Color';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.BLACK,
  },
  innerContainerStyle: {
    backgroundColor: Color.BLACK_50,
    alignItems: 'center',
    borderRadius: moderateScale(50),
    width: moderateScale(370),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(16),
  },
  title: {
    color: Color.WHITE,
    fontSize: moderateScale(26),
    marginBottom: moderateVerticalScale(16),
    marginTop: moderateVerticalScale(8),
    alignSelf: 'flex-start',
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
});

export default styles;
