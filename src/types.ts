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
export interface ShoppingList {
  _id: string;
  title: string;
  user: string;
  items: ShoppingItem[];
}
export interface ShoppingItemContent {
  amount: number;
  name: string;
  unit: string;
}
export interface ShoppingItem {
  _id: string;
  amount: number;
  content: ShoppingItemContent;
}
export interface EditingAmount {
  index: number;
  value: number;
}
export interface ShoppingListSelectProps {
  lists: ShoppingList[];
  currentListIndex: string;
  setCurrentListIndex: (index: string) => void;
}
export interface ShoppingListContextData {
  currentListIndex: string;
  setCurrentListIndex: React.Dispatch<React.SetStateAction<string>>;
}

export interface UserData {
  avatar: string;
  email: string;
  id: string;
  languagePreference: string;
  token: string;
}

export interface UserContextData extends ShoppingListContextData {
  userData: UserData;
}
export interface UserProviderProps {
  children: React.ReactNode;
}