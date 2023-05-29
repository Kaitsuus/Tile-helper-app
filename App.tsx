import React from 'react';
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

type AvatarProps = {
  bg?: string;
  source?: { uri: string };
  children: string;
};

type RootStackParamList = {
  Home: undefined;
  Grout: undefined;
  Adhesive: undefined;
  WaterProof: undefined;
  Plaster: undefined;
  ShoppingList: undefined;
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

const Stack = createStackNavigator<RootStackParamList>();

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

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <NativeBaseProvider>
      <RootNavigator />
    </NativeBaseProvider>
  );
};

export default App;
