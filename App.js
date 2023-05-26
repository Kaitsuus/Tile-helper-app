import React, { useState, createContext, useContext, useEffect } from 'react';
import { NativeBaseProvider, Center } from "native-base";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import Home from './screens/Home';
import Grout from './screens/Grout';
import Adhesive from './screens/Adhesive';
import WaterProof from './screens/WaterProof';
import Plaster from './screens/Plaster';
import Test from './screens/Test';


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
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#ED7931',
        }}
      />
      <Stack.Screen
        name="Adhesive"
        component={Adhesive}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#ED7931',
        }}
      />
      <Stack.Screen
        name="WaterProof"
        component={WaterProof}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#ED7931',
        }}
      />
      <Stack.Screen
        name="Plaster"
        component={Plaster}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#ED7931',
        }}
      />
      <Stack.Screen
        name="Test"
        component={Test}
        options={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#ED7931',
        }}
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
  return (
    <NativeBaseProvider>
      <RootNavigator />
    </NativeBaseProvider>
  );
}
