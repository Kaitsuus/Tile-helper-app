import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { RootStackParamList, HomeScreenNavigationProp } from '../types';

type NavigationButtonProps = {
  screenName: keyof RootStackParamList;
  title: string;
};

const NavigationButton: React.FC<NavigationButtonProps> = ({
  screenName,
  title
}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const navigateToScreen = () => {
    navigation.navigate(screenName);
  };

  return (
    <Button
      size="lg"
      onPress={navigateToScreen}
      bg="#EF6F20"
      _text={{ fontSize: 'xl', fontWeight: 'bold' }}
      mt="2"
    >
      {title}
    </Button>
  );
};

export default NavigationButton;
