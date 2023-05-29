import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
export type RootStackParamList = {
    Home: undefined;
    Grout: undefined;
    Adhesive: undefined;
    WaterProof: undefined;
    Plaster: undefined;
    Test: undefined;
};
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
