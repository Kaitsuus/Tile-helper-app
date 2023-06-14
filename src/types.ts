import {
  StackNavigationProp
} from '@react-navigation/stack';
import {
  RouteProp
} from '@react-navigation/native';
export type RootStackParamList = {
  Home: undefined;
  Grout: undefined;
  Adhesive: undefined;
  WaterProof: undefined;
  Plaster: undefined;
  ShoppingList: undefined;
  Login: undefined;
  Signup: undefined;
  Auth: undefined;
};
export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;
export type AuthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Auth'
>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type StackProps = {
  navigation: HomeScreenNavigationProp;
};
export type AuthStackParamList = {
  Auth: undefined;
};
export type HomeStackParamList = {
  Home: undefined;
};
export type LoginProps = {
  handleLogin: (username: string, password: string) => void;
  handleSignup: () => void;
};
