import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Home from './component/Home';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7b2ff2" />
      <Home />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6c6f5',
  },
});

export default App;
