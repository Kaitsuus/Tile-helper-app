import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Box, Text, Center, Heading } from 'native-base';
import NavigationButton from '../src/components/NavigationButton';

const Home: React.FC = () => {
  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Heading size="2xl" color="#D9D9D9" pt="5">
        TERVETULOA
      </Heading>
      <Heading size="xl" color="#D9D9D9" pt="5">
        Käyttäjä
      </Heading>
      <Box pt="16" w="90%" maxW="290" position="relative">
        <NavigationButton screenName="Grout" title="Saumaus" />
        <NavigationButton screenName="WaterProof" title="Vedeneristys" />
        <NavigationButton screenName="Adhesive" title="Kiinnitys" />
        <NavigationButton screenName="Plaster" title="Tasoitus" />
        <NavigationButton screenName="ShoppingList" title="Oma lista" />
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
