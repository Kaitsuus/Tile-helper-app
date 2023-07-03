import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';

/**
 * @component HeaderLeft
 * @description The HeaderLeft component.
 * @returns {React.FC} A React functional component.
 */
const HeaderLeft: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  /**
   * @function navigateToHome
   * @description Navigate to the Home screen.
   */
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <TouchableOpacity style={{ paddingLeft: 10 }} onPress={navigateToHome}>
      <Image
        source={require('../../assets/apuriLogo.png')}
        style={{ width: 50, height: 50, marginLeft: 10 }}
        resizeMode="contain"
        alt="Apuri logo"
      />
    </TouchableOpacity>
  );
};

export default HeaderLeft;
