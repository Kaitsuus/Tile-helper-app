import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';

const HeaderLeft: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigateToHome()}>
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