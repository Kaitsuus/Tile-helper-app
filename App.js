import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import Home from './screens/Home';
import Grout from './screens/Grout';
import Adhesive from './screens/Adhesive';
import WaterProof from './screens/WaterProof';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTransparent: true,
          headerTintColor: 'black',
          headerTitle: () => (
            <Image
              source={require('./assets/apuriLogo.png')}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          )
        }}
      />
      <Stack.Screen
        name="Grout"
        component={Grout}
        options={{ headerStyle: { backgroundColor: 'black' } }}
      />
      <Stack.Screen
        name="Adhesive"
        component={Adhesive}
        options={{ headerStyle: { backgroundColor: 'black' } }}
      />
      <Stack.Screen
        name="WaterProof"
        component={WaterProof}
        options={{ headerStyle: { backgroundColor: 'black' } }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}

export default function App() {
  return <RootNavigator />;
}
