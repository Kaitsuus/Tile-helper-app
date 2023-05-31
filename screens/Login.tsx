import React, { useState } from 'react';
import { TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Box, Text, Center, Heading, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';
import { LoginProps } from '../src/types';


const Login: React.FC<LoginProps> = ({ handleLogin, handleSignup }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLoginPress = () => {
    if (username === '') {
      Alert.alert('Error', 'Please enter a username');
    } else {
      handleLogin(); // Call the handleLogin prop to handle the login logic

      // You can also use the navigation object directly
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup')
  }

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Box safeArea mb={5}>
      <Image
        source={require('../assets/apuriLogo.png')}
        style={{ width: 80, height: 80,}}
        resizeMode="contain"
        alt="Apuri logo"
      />
      </Box>
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="80%">
      <Heading size="2xl" color="#D9D9D9" py="2" textAlign="center">
        KIRJAUDU
      </Heading>
        <TextInput
          placeholder="Käyttäjätunnus"
          value={username}
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholder="Salasana"
          value={password}
          style={styles.input}
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Button
          onPress={handleLoginPress}
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
        >
          Kirjaudu
        </Button>
        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14, paddingTop: 2 }}>
          Etkö ole käyttäjä?{' '}
        </Text>
        <TouchableOpacity onPress={handleSignupPress} style={{marginLeft: -2 }}>
          <Text style={{ color: '#EF6F20', fontWeight: '600', fontSize: 14 }}>
            {' '}
            Rekisteröidy
          </Text>
        </TouchableOpacity>
      </Box>
      <Box
        w="100%"
        position="absolute"
        height="80%"
        bottom="0"
        background="#242424"
        opacity="100"
        roundedTopLeft="20"
        zIndex="-10"
      ></Box>
    </Center>
  );
};

export default Login;
