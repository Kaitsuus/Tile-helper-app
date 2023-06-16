import React, { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {
  createStackNavigator,
} from '@react-navigation/stack';
import Home from './screens/Home';
import Grout from './screens/Grout';
import Adhesive from './screens/Adhesive';
import WaterProof from './screens/WaterProof';
import Plaster from './screens/Plaster';
import ShoppingList from './screens/ShoppingList';
import { RootStackParamList } from './src/types';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AuthContext from './service/AuthContext';
import { UserProvider } from './service/UserContext';
import HeaderAvatar from './src/components/HeaderAvatar';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [user, setUser] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NativeBaseProvider>
        <NavigationContainer>
          <UserProvider>
            <Stack.Navigator>
              {user ? (
                <Stack.Group
                  screenOptions={{
                    headerTransparent: true,
                    headerTintColor: '#EF6F20',
                    headerLeft: () => (
                      <TouchableOpacity
                        style={{ paddingLeft: 10 }}
                      >
                        <Image
                          source={require('./assets/apuriLogo.png')}
                          style={{ width: 50, height: 50, marginLeft: 10 }}
                          resizeMode="contain"
                          alt="Apuri logo"
                        />
                      </TouchableOpacity>
                    ),
                    headerRight: () => <HeaderAvatar />
                  }}
                >
                  <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
                  <Stack.Screen
                    name="Grout"
                    component={Grout}
                    options={{ title: 'Grout' }}
                  />
                  <Stack.Screen
                    name="Adhesive"
                    component={Adhesive}
                    options={{ title: 'Adhesive' }}
                  />
                  <Stack.Screen
                    name="WaterProof"
                    component={WaterProof}
                    options={{ title: 'WaterProof' }}
                  />
                  <Stack.Screen
                    name="Plaster"
                    component={Plaster}
                    options={{ title: 'Plaster' }}
                  />
                  <Stack.Screen
                    name="ShoppingList"
                    component={ShoppingList}
                    options={{ title: 'ShoppingList' }}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Signup" component={Signup} />
                </Stack.Group>
              )}
            </Stack.Navigator>
          </UserProvider>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthContext.Provider>
  );
};

export default App;
