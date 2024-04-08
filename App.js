import {StyleSheet, Text, View, AppState} from 'react-native';
import React from 'react';
import Navigation from './src/navigation/Navigation';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Navigation />
    </View>
  );
};

export default App;
