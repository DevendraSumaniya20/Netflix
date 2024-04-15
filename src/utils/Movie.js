import {MOVIEAPIKEY} from '../config/APIkeys';

import axios from 'axios';
import ImagePath from '../constants/ImagePath';

const apiBaseUrl = `https://api.themoviedb.org/3`;

// account info

const accountEndPoint = id =>
  `${apiBaseUrl}/account/${id}?api_key=${MOVIEAPIKEY}`;

//
// Movies EndsPoints
const trendingMoviesEndPoint = `${apiBaseUrl}/trending/movie/day?api_key=${MOVIEAPIKEY}`;
const topRatedMoviesEndPoint = `${apiBaseUrl}/movie/top_rated?api_key=${MOVIEAPIKEY}`;
const upcomingMoviesEndPoint = `${apiBaseUrl}/movie/upcoming?api_key=${MOVIEAPIKEY}`;
const popularMoviesEndPoint = `${apiBaseUrl}/movie/popular?api_key=${MOVIEAPIKEY}`;
const nowPlayingMoviesEndPoint = `${apiBaseUrl}/movie/now_playing?api_key=${MOVIEAPIKEY}`;
const movieRecommendationsMoviesEndPoint = `${apiBaseUrl}/movie/movie_id/recommendations?api_key=${MOVIEAPIKEY}`;
const movieDetailsEndPoint = id =>
  `${apiBaseUrl}/movie/${id}?api_key=${MOVIEAPIKEY}`;
const movieCreditsEndPoint = id =>
  `${apiBaseUrl}/movie/${id}/credits?api_key=${MOVIEAPIKEY}`;

const movieSimilarEndPoint = id =>
  `${apiBaseUrl}/movie/${id}/similar?api_key=${MOVIEAPIKEY}`;

const movieSearchEndPoint = `${apiBaseUrl}/movie/search/movie?api_key=${MOVIEAPIKEY}`;
//

// TvShows EndsPoints
const trendingTvEndPoint = `${apiBaseUrl}/trending/tv/day?api_key=${MOVIEAPIKEY}`;
const topRatedTvEndPoint = `${apiBaseUrl}/tv/top_rated?api_key=${MOVIEAPIKEY}`;
const popularTvEndPoint = `${apiBaseUrl}/tv/popular?api_key=${MOVIEAPIKEY}`;
const airingTodayEndPoint = `${apiBaseUrl}/tv/airing_today?api_key=${MOVIEAPIKEY}`;
const tvDetailsEndPoint = id => `${apiBaseUrl}/tv/${id}?api_key=${MOVIEAPIKEY}`;
const tvCreditsEndPoint = id =>
  `${apiBaseUrl}/tv/${id}/credits?api_key=${MOVIEAPIKEY}`;

const tvSimilarEndPoint = id =>
  `${apiBaseUrl}/tv/${id}/similar?api_key=${MOVIEAPIKEY}`;

//

//

// dynamic images
export const image500 = path => {
  return path ? `https://image.tmdb.org/t/p/w500/${path}` : null;
};
export const image342 = path => {
  return path ? `https://image.tmdb.org/t/p/w342/${path}` : null;
};

export const image182 = path => {
  return path ? `https://image.tmdb.org/t/p/w182/${path}` : null;
};

export const NoImage = ImagePath.NOIMAGE;

//

//

// api call GET
const apiCall = async (endpoint, params) => {
  const options = {
    method: 'GET',
    url: endpoint,
    params: params ? params : {},
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const fetchTrendingMovies = () => {
  return apiCall(trendingMoviesEndPoint);
};

export const fetchUpcomingMovies = () => {
  return apiCall(upcomingMoviesEndPoint);
};

export const fetchTopRatedMovies = () => {
  return apiCall(topRatedMoviesEndPoint);
};

export const fetchPopularMovies = () => {
  return apiCall(popularMoviesEndPoint);
};

export const fetchNowPlayingMovies = () => {
  return apiCall(nowPlayingMoviesEndPoint);
};

export const fetchMoviewRecommendationMovies = () => {
  return apiCall(movieRecommendationsMoviesEndPoint);
};

export const fetchMovieDetails = id => {
  return apiCall(movieDetailsEndPoint(id));
};

export const fetchMovieCredits = id => {
  return apiCall(movieCreditsEndPoint(id));
};

export const fetchMovieSimilar = id => {
  return apiCall(movieSimilarEndPoint(id));
};

export const fetchMovieSearch = params => {
  return apiCall(movieSearchEndPoint, params);
};

export const fetchTrendingTvShows = () => {
  return apiCall(trendingTvEndPoint);
};

export const fetchTopRatedTvShows = () => {
  return apiCall(topRatedTvEndPoint);
};

export const fetchPopularTvShows = () => {
  return apiCall(popularTvEndPoint);
};

export const fetchAiringTodayTvShows = () => {
  return apiCall(airingTodayEndPoint);
};

export const fetchTvDetails = id => {
  return apiCall(tvDetailsEndPoint(id));
};

export const fetchTvCredits = id => {
  return apiCall(tvCreditsEndPoint(id));
};

export const fetchTvSimilar = id => {
  return apiCall(tvSimilarEndPoint(id));
};

export const fetchAccountDetails = id => {
  return apiCall(accountEndPoint, id);
};
