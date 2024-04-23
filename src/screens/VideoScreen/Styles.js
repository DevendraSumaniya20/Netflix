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
    backgroundColor: Color.BLACK,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Color.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  marginContainer: {
    marginHorizontal: moderateScale(16),
  },
  poster: {
    width: moderateScale(350),
    height: moderateVerticalScale(350),
    borderRadius: moderateScale(10),
  },
  textStyle: {
    color: Color.WHITE,
  },
  titleTextStyle: {
    color: Color.WHITE,
    fontSize: scale(24),
    fontWeight: '800',
    marginVertical: moderateScale(8),
  },
  runtimeTextStyle: {
    color: Color.WHITE,
    marginHorizontal: moderateScale(6),
    fontSize: scale(14),
  },
  releasedateTextStyle: {
    color: Color.WHITE,
    fontSize: scale(14),
  },
  underAgeTextStyle: {
    backgroundColor: Color.GRAY,
    marginHorizontal: moderateScale(24),
    color: Color.WHITE,
    paddingHorizontal: moderateScale(8),
    fontSize: scale(14),
    textAlign: 'center',
  },
  overviewTextStyle: {
    color: Color.WHITE,
    fontSize: scale(14),
    marginVertical: moderateVerticalScale(8),
  },
  StarringOverViewTextStyle: {color: Color.WHITE, fontSize: scale(14)},
  StarringTextStyle: {
    color: Color.GRAY,
    fontSize: scale(14),
    marginBottom: moderateVerticalScale(2),
  },
  moreTextStyle: {color: Color.WHITE, fontSize: scale(14)},
  directorTextStyle: {color: Color.WHITE, fontSize: scale(14)},
  companyTextStyle: {color: Color.GRAY, fontSize: scale(14)},

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.BLACK_50,
  },
  modalContent: {
    backgroundColor: Color.BLACK_90,
    borderRadius: moderateScale(10),
    padding: moderateScale(20),
    maxHeight: '100%',
    alignItems: 'center',
    width: '100%',
  },

  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(10),
    color: Color.WHITE,
  },
  modalItem: {
    fontSize: scale(16),
    marginBottom: moderateVerticalScale(8),
    color: Color.GRAY_2,
  },
  genreItemContainer: {
    width: '100%',
  },
  closeButtonContainer: {
    alignItems: 'center',
    marginRight: moderateScale(-300),
    marginTop: moderateScale(16),
    flexDirection: 'row',
  },
  tabButton: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateVerticalScale(10),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: Color.WHITE,
  },
  activeTab: {
    borderBottomColor: 'blue',
  },

  similarimages: {
    width: moderateScale(130),
    height: moderateVerticalScale(150),
    borderRadius: moderateScale(10),
    marginBottom: moderateVerticalScale(8),
  },
  collectionImageTv: {
    width: moderateScale(160),
    height: moderateVerticalScale(150),
    borderRadius: moderateScale(10),
    marginBottom: moderateVerticalScale(8),
  },
  collectionImageMovie: {
    width: moderateScale(160),
    height: moderateVerticalScale(150),
    borderRadius: moderateScale(10),
    marginBottom: moderateVerticalScale(8),
  },
});

export default styles;
