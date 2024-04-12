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
  backgroundContainer: {},
  backgroundImage: {
    height: moderateScale(500),
    width: 'auto',
  },
  marginView: {
    marginHorizontal: moderateScale(16),
  },
  logo: {
    marginTop: moderateScale(8),
    height: moderateScale(40),
    width: moderateScale(40),
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
  },
  topViewTextStyle: {
    color: '#fff',
    fontSize: scale(16),
  },
  downView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  downViewTextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: scale(16),
  },
  centerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  secondMainView: {
    // flex: 1,
  },
  mainHearder: {
    color: Color.WHITE,
    fontSize: scale(16),
    fontWeight: '800',
  },
  mainHeader: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginTop: moderateScale(10),
    marginBottom: moderateVerticalScale(4),
    color: Color.WHITE,
  },
});

export default styles;
