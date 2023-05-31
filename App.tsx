import React, { useState} from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Avatar } from 'native-base';
import { NavigationContainer, useNavigation, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import Home from './screens/Home';
import Grout from './screens/Grout';
import Adhesive from './screens/Adhesive';
import WaterProof from './screens/WaterProof';
import Plaster from './screens/Plaster';
import ShoppingList from './screens/ShoppingList';
import { RootStackParamList, HomeScreenNavigationProp } from './src/types';
import Login from './screens/Login';
import Signup from './screens/Signup';


const Stack = createStackNavigator<RootStackParamList>();

const AuthStack: React.FC<{ handleLogin: () => void; handleSignup: () => void }> = ({ handleLogin, handleSignup }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} handleLogin={handleLogin} handleSignup={handleSignup} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};


const HomeStack: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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
      <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
      <Stack.Screen name="Grout" component={Grout} options={{ title: 'Grout' }} />
      <Stack.Screen name="Adhesive" component={Adhesive} options={{ title: 'Adhesive' }} />
      <Stack.Screen name="WaterProof" component={WaterProof} options={{ title: 'WaterProof' }} />
      <Stack.Screen name="Plaster" component={Plaster} options={{ title: 'Plaster' }} />
      <Stack.Screen name="ShoppingList" component={ShoppingList} options={{ title: 'ShoppingList' }} />
    </Stack.Navigator>
  );
};

const RootNavigator: React.FC<{ user: boolean; handleLogin: () => void; handleSignup: () => void }> = ({ user, handleLogin, handleSignup }) => {
  return (
    <NavigationContainer>
       {user ? <HomeStack /> : <AuthStack handleLogin={handleLogin} handleSignup={handleSignup}/>}
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState(false);

  const handleLogin = () => {
    setUser(true);
  };

  const handleSignup = () => {
    // Handle signup logic here
  };
  return (
    <NativeBaseProvider>
      <RootNavigator user={user} handleLogin={handleLogin} handleSignup={handleSignup} />
    </NativeBaseProvider>
  );
};

export default App;