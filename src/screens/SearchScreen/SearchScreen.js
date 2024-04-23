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
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = ({navigation, route}) => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const storedSuggestions = await AsyncStorage.getItem('searchSuggestions');
      if (storedSuggestions !== null) {
        setSuggestions(JSON.parse(storedSuggestions));
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const saveSearchToSuggestions = async searchValue => {
    try {
      let updatedSuggestions = [
        searchValue,
        ...suggestions.filter(suggestion => suggestion !== searchValue),
      ];

      updatedSuggestions = updatedSuggestions.slice(0, 5);
      await AsyncStorage.setItem(
        'searchSuggestions',
        JSON.stringify(updatedSuggestions),
      );
      setSuggestions(updatedSuggestions);
    } catch (error) {
      console.error('Error saving search suggestion:', error);
    }
  };

  const handleSearch = useCallback(async searchValue => {
    setLoading(true);
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
        ...movieResults.results.map(item => ({...item, mediaType: 'movie'})),
        ...tvResults.results.map(item => ({...item, mediaType: 'tv'})),
      ];
      console.log(combinedResults);

      setResults(combinedResults);

      if (searchValue) {
        saveSearchToSuggestions(searchValue);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
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

    if (!text) {
      saveSearchToSuggestions(value);
    }
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
          placeholder={'Search for a show, movie, genre, etc.'}
          placeholderTextColor={Color.WHITE}
          value={value}
        />
      </View>

      {loading ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size={'large'} color={Color.RED} />
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
          <Text style={styles.centeredText}>
            Please search your favorite shows and movies
          </Text>
        </View>
      )}

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => onChangeText(suggestion)}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    color: Color.WHITE,
  },
  suggestionsContainer: {
    marginTop: moderateVerticalScale(10),
    paddingHorizontal: moderateVerticalScale(16),
  },
  suggestionsTitle: {
    color: Color.WHITE,
    marginBottom: moderateScale(8),
  },
  suggestionItem: {
    backgroundColor: Color.GRAY,
    paddingVertical: moderateVerticalScale(8),
    paddingHorizontal: moderateVerticalScale(12),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(8),
  },
  suggestionText: {
    color: Color.WHITE,
  },
});
