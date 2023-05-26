import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Box, Text, Center, Heading } from 'native-base';
const Home = () => {
  const navigation = useNavigation();
  
  return (
    <Center w="100%" flex={1} px="3" background='#D9D9D9'>
     <Heading size="2xl" color="#D9D9D9" pt="5">TERVETULOA</Heading>
    <Heading size="xl" color="#D9D9D9" pt="5">Käyttäjä</Heading>
    <Box pt='16' w="90%" maxW="290" position='relative'>
      <Button
      size='lg'
        onPress={() => navigation.navigate('Grout')}
        bg='#EF6F20'
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
      >
        Saumaus
      </Button>
      <Button
      size='lg'
        onPress={() => navigation.navigate('WaterProof')}
        bg='#EF6F20'
        _text={{fontSize: "xl", fontWeight: 'bold',}}
        mt="2"
      >
        Vedeneristys
      </Button>
      <Button
        size='lg'
        onPress={() => navigation.navigate('Adhesive')}
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        bg='#EF6F20'
        mt="2"
      >
        Kiinnitys
      </Button>
      <Button
        size='lg'
        onPress={() => navigation.navigate('Plaster')}
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        bg='#EF6F20'
        mt="2"
      >
        Tasoitus
      </Button>
      <Button
      size='lg'
        onPress={() => navigation.navigate('Test')}
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        bg='#EF6F20'
        mt="2"
      >
        Tasausjärjestelmät
      </Button>
    </Box>
    <Box w="100%" position='absolute' height='85%' bottom='0' background='#242424' opacity='100' roundedTopLeft='20' zIndex='-10'></Box>
    </Center>
  );
};

export default Home;
