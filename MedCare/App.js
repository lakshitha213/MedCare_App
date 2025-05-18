import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './component/Home';
import Login from './component/Login';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
       
        {/* You can add more screens here, for example:
         <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Profile" component={AboutUs} />
        <Stack.Screen name="Channeling" component={Channeling} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6c6f5',
  },
});
