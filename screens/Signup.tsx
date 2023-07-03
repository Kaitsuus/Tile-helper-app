import React, { useState } from 'react';
import { TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Box, Text, Center, Image, Heading } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';
import { LoginProps } from '../src/types';
import { signupUser } from '../service/auth'

/**
 * @component Signup
 * @description The Signup component for user registration.
 * @param {LoginProps} handleLogin - The login function passed as a prop.
 * @param {LoginProps} handleSignup - The signup function passed as a prop.
 * @returns {React.FC} A React functional component.
 */
const Signup: React.FC<LoginProps>= ({ handleLogin, handleSignup }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordAgain, setPasswordAgain] = useState<string>('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  /**
   * Handles the signup button press.
   * Validates the email and password fields, then calls the signupUser function.
   */
  const handleSignupPress = async () => {
    if (email === '') {
      Alert.alert('Error', 'Please enter a username');
    } else if (password !== passwordAgain) {
      Alert.alert('Error', "Passwords don't match");
    } else {
      try {
        await signupUser(email, password); // Call the signupUser function
        Alert.alert('Success', 'You have successfully registered');
        navigation.navigate('Login');
      } catch (error) {
        // Display the custom error message from the server
        Alert.alert('Error', error.message);
      }
    }
  };

  /**
   * Handles the login button press.
   * Navigates to the Login screen.
   */
  const handleLoginPress = () => {
    navigation.navigate('Login')
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
        REKISTERÖIDY
      </Heading>
        <TextInput
          placeholder="Email"
          value={email}
          style={styles.input}
          keyboardType="email-address"
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
        <TextInput
          placeholder="Salasana uudelleen"
          value={passwordAgain}
          style={styles.input}
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(text) => setPasswordAgain(text)}
        />
        <Button
          onPress={handleSignupPress}
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
        >
          Rekisteröidy
        </Button>
        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14, paddingTop: 2 }}>
          Oletko jo rekisteröitynyt?{' '}
        </Text>
        <TouchableOpacity onPress={handleLoginPress} style={{marginLeft: -2 }}>
          <Text style={{ color: '#EF6F20', fontWeight: '600', fontSize: 14 }}>
            {' '}
            Login
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

export default Signup;
