import {StyleSheet} from 'react-native';
import Color from '../../constants/Color';
import {
  moderateScale,
  scale,
  moderateVerticalScale,
} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  mainHeader: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginVertical: moderateVerticalScale(8),
    color: Color.WHITE,
  },
  marginContainer: {
    flex: 1,
    marginHorizontal: moderateScale(16),
  },
});

export default styles;
