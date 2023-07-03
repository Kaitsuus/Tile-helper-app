import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Avatar } from 'native-base';
import { useUserContext } from '../../service/UserContext';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';

/**
 * @component HeaderAvatar
 * @description The HeaderAvatar component.
 * @returns {React.FC} A React functional component.
 */
const HeaderAvatar: React.FC = () => {
  const { userData } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  /**
   * @function navigateToUserMenu
   * @description Navigate to the UserMenu screen.
   */
  const navigateToUserMenu = () => {
    navigation.navigate('UserMenu');
  };

  return (
    <TouchableOpacity style={{ paddingRight: 15 }} onPress={navigateToUserMenu}>
      <Avatar bg="#EF6F20">
        {userData && userData.email ? userData.email[0].toUpperCase() : 'A'}
      </Avatar>
    </TouchableOpacity>
  );
};

export default HeaderAvatar;
