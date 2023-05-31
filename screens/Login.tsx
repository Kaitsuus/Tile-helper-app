import React, { useState } from 'react';
import { TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Box, Text, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';

type LoginProps = {
  handleLogin: () => void;
  handleSignup: () => void;
};

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
      navigation.navigate('Home');
    }
  };

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="80%">
        <TextInput
          placeholder="Username"
          value={username}
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholder="Password"
          value={password}
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => setPassword(text)}
        />
        <Button
          onPress={handleLoginPress}
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
        >
          Login
        </Button>
        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={{ color: '#3cd6eb', fontWeight: '600', fontSize: 14 }}>
            {' '}
            Sign Up
          </Text>
        </TouchableOpacity>
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

export default Login;
