import {View} from 'react-native';
import React from 'react';
import Navigation from './src/navigation/Navigation';
import store from './src/redux/store';
import {Provider} from 'react-redux';
const App = () => {
  return (
    <View style={{flex: 1}}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </View>
  );
};

export default App;
