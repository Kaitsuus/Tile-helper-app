import React, { useState } from 'react';
import { TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Box, Text, Center, Heading, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';
import { login } from '../service/auth'; // Assuming you have an API function to handle login
import { useAuth } from '../service/AuthContext';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      console.log('Login successful:', response.data);
      setUser(true); // Update the user state after successful login
    } catch (error) {
      console.error('Login failed:', error);
      // Show an error message to the user
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
          value={email}
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => setEmail(text)}
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
          onPress={() => handleLogin(email, password)}
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
