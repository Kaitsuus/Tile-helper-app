/**
 * @module Login
 * @description This module exports the Login component which is used to render the login screen of the app.
 */

import React, { useState } from 'react';
import { TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Box, Text, Center, Heading, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';
import { login } from '../service/auth';
import { useAuth } from '../service/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * @function Login
 * @description This is the functional component for the Login screen.
 * @returns {React.FC} A React functional component.
 */

const Login: React.FC = () => {
  /**
   * @typedef {Object} State
   * @property {string} email - The email input state.
   * @property {string} password - The password input state.
   * @property {function} setUser - Function from AuthContext to set the user state.
   * @var {Object} navigation - Navigation object from react-navigation.
   */

  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  /**
   * @function handleLogin
   * @description Handles the login process.
   * @param {string} email - The email input value.
   * @param {string} password - The password input value.
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      console.log('Login successful:', response.data);
      setUser(true); // Update the user state after successful login
    } catch (error) {
      console.error('Login failed:', error);
      // Show the custom error message from the server in an alert
      Alert.alert('Error', error.message);
    }
  };

  /**
   * @function handleSignupPress
   * @description Handles the press event on the signup button.
   */
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
      {t('login')}
      </Heading>
        <TextInput
          placeholder="Email"
          value={email}
          style={styles.input}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder={t('pwPlaceHolder')}
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
          {t('loginButton')}
        </Button>
        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14, paddingTop: 2 }}>
        {t('notUser')}{' '}
        </Text>
        <TouchableOpacity onPress={handleSignupPress} style={{marginLeft: -2 }}>
          <Text style={{ color: '#EF6F20', fontWeight: '600', fontSize: 14 }}>
            {' '}
            {t('register')}
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
