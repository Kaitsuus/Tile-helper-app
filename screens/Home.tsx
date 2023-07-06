/**
 * @module Home
 * @description This module exports the Home component which is used to render the main screen of the app.
 */

import React from 'react';
import { Box, Center, Heading } from 'native-base';
import NavigationButton from '../src/components/NavigationButton';
import { useUserContext } from '../service/UserContext';
import { useTranslation } from 'react-i18next';

/**
 * @function Home
 * @description This is the functional component for the Home screen.
 * @returns {React.FC} A React functional component.
 */

const Home: React.FC = () => {
  /**
   * @var {Object} userData - The user data derived from the UserContext.
   * @var {string} userEmailPrefix - The prefix of the user's email address.
   */

  const { t } = useTranslation();
  const { userData } = useUserContext();
  const userEmailPrefix = userData?.email.split('@')[0];

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Heading size="2xl" color="#D9D9D9" pt="5">
        {t('welcome')}
      </Heading>
      <Heading size="xl" color="#D9D9D9" pt="5">
        {userEmailPrefix}
      </Heading>
      <Box pt="16" w="90%" maxW="290" position="relative">
        <NavigationButton screenName="Grout" title={t('grout')} />
        <NavigationButton screenName="WaterProof" title={t('waterproof')} />
        <NavigationButton screenName="Adhesive" title={t('adhesive')} />
        <NavigationButton screenName="Plaster" title={t('plaster')} />
        <NavigationButton screenName="ShoppingList" title={t('list')} />
      </Box>
      <Box
        w="100%"
        position="absolute"
        height="85%"
        bottom="0"
        background="#242424"
        opacity="100"
        roundedTopLeft="20"
        zIndex="-10"
      ></Box>
    </Center>
  );
};

export default Home;
