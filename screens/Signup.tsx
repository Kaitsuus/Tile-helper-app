import React, { useState } from 'react';
import { TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Box, Text, Center, Image, Heading } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';
import { LoginProps } from '../src/types';

const Signup: React.FC<LoginProps>= ({ handleLogin, handleSignup }) => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordAgain, setPasswordAgain] = useState<string>('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleSignupPress = () => {
    if (username === '') {
      Alert.alert('Error', 'Please enter a username');
    } else {
      handleLogin(); // Call the handleLogin prop for now
      navigation.navigate('Home');
    }
  };

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
