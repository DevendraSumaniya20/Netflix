import {MOVIEAPIKEY} from '../config/APIkeys';

import axios from 'axios';

const apiBaseUrl = `https://api.themoviedb.org/3`;

const trendingMoviesEndPoint = `${apiBaseUrl}/trending/movie/day?api_key=${MOVIEAPIKEY}`;
const topRatedMoviesEndPoint = `${apiBaseUrl}/movie/top_rated?api_key=${MOVIEAPIKEY}`;
const upcomingMoviesEndPoint = `${apiBaseUrl}/movie/upcoming?api_key=${MOVIEAPIKEY}`;
const popularMoviesEndPoint = `${apiBaseUrl}/movie/popular?api_key=${MOVIEAPIKEY}`;
const nowPlayingMoviesEndPoint = `${apiBaseUrl}/movie/now_playing?api_key=${MOVIEAPIKEY}`;
const movieRecommendationsMoviesEndPoint = `${apiBaseUrl}/movie/movie_id/recommendations?api_key=${MOVIEAPIKEY}`;

const trendingTvEndPoint = `${apiBaseUrl}/trending/tv/day?api_key=${MOVIEAPIKEY}`;
const topRatedTvEndPoint = `${apiBaseUrl}/tv/top_rated?api_key=${MOVIEAPIKEY}`;
const popularTvEndPoint = `${apiBaseUrl}/tv/popular?api_key=${MOVIEAPIKEY}`;
const airingTodayEndPoint = `${apiBaseUrl}/tv/airing_today?api_key=${MOVIEAPIKEY}`;

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
