
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Avatar } from 'native-base';
import { useUserContext } from '../../service/UserContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, HomeScreenNavigationProp } from '../types';

const HeaderAvatar: React.FC = () => {
  const { userData } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigateToShoppingList = () => {
    navigation.navigate('Home');
  };

  return (
    <TouchableOpacity style={{ paddingRight: 15 }} onPress={() => navigateToShoppingList()}>
      <Avatar bg="#EF6F20">
        {userData && userData.email ? userData.email[0].toUpperCase() : 'A'}
      </Avatar>
    </TouchableOpacity>
  );
};

export default HeaderAvatar;