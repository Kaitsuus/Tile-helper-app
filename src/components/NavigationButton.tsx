import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { RootStackParamList, HomeScreenNavigationProp } from '../types';

/**
 * @interface NavigationButtonProps
 * @description Represents the props for the NavigationButton component.
 * @property {keyof RootStackParamList} screenName - The name of the screen to navigate to.
 * @property {string} title - The title of the button.
 */
type NavigationButtonProps = {
  screenName: keyof RootStackParamList;
  title: string;
};

/**
 * @component NavigationButton
 * @description The NavigationButton component.
 * @param {NavigationButtonProps} props - The props for the NavigationButton component.
 * @returns {React.FC} A React functional component.
 */
const NavigationButton: React.FC<NavigationButtonProps> = ({
  screenName,
  title
}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  /**
   * @function navigateToScreen
   * @description Navigate to the specified screen.
   */
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
