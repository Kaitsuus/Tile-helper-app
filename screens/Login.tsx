/**
 * @module Login
 * @description This module exports the Login component which is used to render the login screen of the app.
 */

import React, { useState } from 'react';
import { TouchableOpacity, TextInput } from 'react-native';
import { Button, Box, Text, Center, Heading, Image, Select, CheckIcon, Spinner, Toast, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';
import { login, resetPassword } from '../service/auth';
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
   * @property {boolean} loading - The loading state.
   * @property {function} setUser - Function from AuthContext to set the user state.
   * @var {Object} navigation - Navigation object from react-navigation.
   */

  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  /**
   * @function changeLanguage
   * @description Handles the language change.
   * @param {string} language - The language value.
   */
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  /**
   * @function handleLogin
   * @description Handles the login process.
   * @param {string} email - The email input value.
   * @param {string} password - The password input value.
   */
  const handleLogin = async (email: string, password: string) => {
    // Check if the loading state is true, if yes, return early
    if (loading) {
      return;
    }

    try {
      setLoading(true); // Set loading state to true when starting the login process
      const response = await login(email, password);
      console.log('Login successful:', response.data);
      setUser(true);
    } catch (error) {
      console.error('Login failed:', error);
      Toast.show({
        title: 'Error',
        variant: "subtle",
        description: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false); // Set loading state to false when login process is done
    }
  };

  /**
   * @function handleResetPassword
   * @description Handles the password reset process.
   * @param {string} email - The email input value.
   */
  const handleResetPassword = async (email: string) => {
    // Check if the loading state is true, if yes, return early
    if (loading) {
      return;
    }

    if (!email) {
      Toast.show({
        title: 'Error',
        description: t('errorEmail'),
        duration: 4000,
      });
      return;
    }

    try {
      setLoading(true); // Set loading state to true when starting the password reset process
      const response = await resetPassword(email);
      console.log('Reset successful:', response.data);
      Toast.show({
        title: 'Success',
        variant: "subtle",
        description: t('succesPasswordReset'),
        duration: 4000,
      });
    } catch (error) {
      console.error('Reset failed:', error);
      Toast.show({
        title: 'Error',
        variant: "subtle",
        description: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false); // Set loading state to false when password reset process is done
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
      {loading && 
      <HStack space={8} justifyContent="center" alignItems="center">
      <Spinner accessibilityLabel="Loading" size={'lg'} color={"orange.400"}/>
      <Heading color="orange.400" fontSize="lg">
        Loading
      </Heading>
      </HStack>
      }
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
        <TouchableOpacity onPress={() => handleResetPassword(email)} style={{marginLeft: -2 }}>
          <Text style={{ color: '#EF6F20', fontWeight: '600', fontSize: 14 }}>
            {' '}
            {t('forgotPassword')}
          </Text>
        </TouchableOpacity>
        <Select
          mt="2"
          bg="white"
          placeholder="Select Language"
          onValueChange={changeLanguage}
          selectedValue={i18n.language}
          _selectedItem={{
            bg: 'orange.500',
            endIcon: <CheckIcon size={3} />
          }}
        >
          <Select.Item label="Finnish" value="fi" />
          <Select.Item label="English" value="en" />
          <Select.Item label="Estonian" value="et" />
          <Select.Item label="Swedish" value="sv" />
        </Select>
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
