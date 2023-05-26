import React from 'react';
import { NativeBaseProvider, Avatar } from 'native-base';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity } from 'react-native';
import Home from './screens/Home';
import Grout from './screens/Grout';
import Adhesive from './screens/Adhesive';
import WaterProof from './screens/WaterProof';
import Plaster from './screens/Plaster';
import Test from './screens/Test';

const Stack = createStackNavigator();

function HomeStack() {
  const navigation = useNavigation();
  const avatarUri = ''; // Replace with the URI or leave it empty

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#EF6F20',
        headerLeft: () => (
          <TouchableOpacity onPress={navigateToHome} style={{ paddingLeft: 10 }}>
          <Image
            source={require('./assets/apuriLogo.png')}
            style={{ width: 50, height: 50, marginLeft: 10 }}
            resizeMode="contain"
          />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ paddingRight: 15 }}>
            <Avatar bg="#EF6F20" source={avatarUri ? { uri: avatarUri } : undefined}>
              {avatarUri ? 'AJ' : 'A'}
            </Avatar>
          </TouchableOpacity>
        ),
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Grout" component={Grout} />
      <Stack.Screen name="Adhesive" component={Adhesive} />
      <Stack.Screen name="WaterProof" component={WaterProof} />
      <Stack.Screen name="Plaster" component={Plaster} />
      <Stack.Screen name="Test" component={Test} />
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
