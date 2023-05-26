import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Box, Text, Center } from 'native-base';
const Home = () => {
  const navigation = useNavigation();

  return (
    <Center w="100%" flex={1} px="3" background='#000'>
    <Box safeArea p="2" py="8" w="90%" maxW="290">
      <Button
        onPress={() => navigation.navigate('Grout')}
        colorScheme="orange"
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
      >
        Saumaus
      </Button>
      <Button
        onPress={() => navigation.navigate('WaterProof')}
        colorScheme="orange"
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
      >
        Vedeneristys
      </Button>
      <Button
        onPress={() => navigation.navigate('Adhesive')}
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        colorScheme="orange"
        mt="2"
      >
        Kiinnitys
      </Button>
      <Button
        onPress={() => navigation.navigate('Plaster')}
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        colorScheme="orange"
        mt="2"
      >
        Tasoitus
      </Button>
      <Button
        onPress={() => navigation.navigate('Test')}
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        colorScheme="orange"
        mt="2"
      >
        Tasausjärjestelmät
      </Button>
    </Box>
    </Center>
  );
};

export default Home;
