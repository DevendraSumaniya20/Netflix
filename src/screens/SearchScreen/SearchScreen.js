import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CustomSearch from '../../components/CustomSearch';
import Color from '../../constants/Color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import navigationString from '../../constants/navigationString';
import CustomIcon from '../../components/CustomIcon';
import {debounce} from 'lodash';
import {fetchMovieSearch, fetchTvSearch, image342} from '../../utils/Movie';
import CustomIconText from '../../components/CustomIconText';

const SearchScreen = ({navigation, route}) => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async searchValue => {
    setLoading(true);
    setError(null);
    try {
      let movieResults = [];
      let tvResults = [];

      if (searchValue) {
        movieResults = await fetchMovieSearch({
          query: searchValue,
          include_adult: false,
          language: 'en-US',
          page: 1,
        });
      }

      if (searchValue) {
        tvResults = await fetchTvSearch({
          query: searchValue,
          language: 'en-US',
          page: 1,
        });
      }

      const combinedResults = [
        ...(movieResults.results || []).map(item => ({
          ...item,
          mediaType: 'movie',
        })),
        ...(tvResults.results || []).map(item => ({
          ...item,
          mediaType: 'tv',
        })),
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Error fetching search results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce(searchValue => handleSearch(searchValue), 300),
    [],
  );

  const onChangeText = text => {
    setValue(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchTextView}>
        <CustomSearch
          iconName={'search'}
          iconName2={'keyboard-voice'}
          iconColor={Color.WHITE}
          iconColor2={Color.WHITE}
          size={scale(24)}
          onChangeText={onChangeText}
          type={'Fontisto'}
          type2={'MaterialIcons'}
          placeholder={'Search your fav Movie or Show'}
          placeholderTextColor={Color.WHITE}
          value={value}
        />
      </View>
      {loading ? (
        <ActivityIndicator
          color={Color.RED}
          size="large"
          style={styles.loadingIndicator}
        />
      ) : error ? (
        <View style={styles.centeredView}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : results && results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.resultText}>Results ({results.length})</Text>
          <View>
            {results.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() =>
                  navigation.navigate(navigationString.VIDEOSCREEN, {
                    searchItem: item.id,
                  })
                }>
                {item.poster_path ? (
                  <Image
                    source={{
                      uri: image342(item.poster_path),
                    }}
                    style={styles.image}
                    resizeMethod="auto"
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.noImageText}>No Image</Text>
                )}
                <Text style={styles.title}>
                  {item.original_title
                    ? item.original_title.length > 22
                      ? `${item.original_title.slice(0, 19)}...`
                      : item.original_title
                    : item.original_name
                      ? item.original_name.length > 22
                        ? `${item.original_name.slice(0, 19)}...`
                        : item.original_name
                      : ''}
                </Text>
                <CustomIcon
                  color={Color.WHITE}
                  name={'play-circle-outline'}
                  size={scale(24)}
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.centeredView}>
          {value ? (
            <>
              <CustomIconText
                color={Color.WHITE}
                iconName={'emoji-sad'}
                type={'Entypo'}
                flexDirection={'column'}
                size={scale(26)}
              />
              <Text style={styles.resultText}>Oops, no results found</Text>
            </>
          ) : (
            <Text style={styles.resultText}>
              Let's check what's new arrive in {'\n'}This weekend!
            </Text>
          )}
        </View>
      )}
      <SafeAreaView style={styles.marginContainer}></SafeAreaView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BLACK,
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
  },
  searchTextView: {
    marginTop: moderateVerticalScale(16),
    paddingHorizontal: moderateVerticalScale(16),
    backgroundColor: Color.GRAY,
  },
  scrollViewContent: {
    paddingHorizontal: moderateVerticalScale(16),
  },
  resultText: {
    color: Color.WHITE,
    marginBottom: moderateScale(8),
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
    paddingHorizontal: moderateVerticalScale(2),
  },
  image: {
    width: moderateScale(150),
    height: moderateVerticalScale(80),
    borderRadius: moderateScale(8),
  },
  noImageText: {
    width: moderateScale(150),
    height: moderateVerticalScale(80),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Color.WHITE,
    backgroundColor: Color.GRAY,
    borderRadius: moderateScale(8),
  },
  title: {
    flex: 1,
    color: Color.WHITE,
    marginLeft: moderateScale(10),
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    color: Color.WHITE,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: scale(16),
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
