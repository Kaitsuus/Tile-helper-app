import React, { useState } from 'react';
import { TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button, Box, Text, Center, Image, Heading, Spinner, Toast, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { HomeScreenNavigationProp } from '../src/types';
import { LoginProps } from '../src/types';
import { signupUser, verificationLink } from '../service/auth'
import { useTranslation } from 'react-i18next';
import RequestVerification from '../src/components/RequestVerificationModal';

/**
 * @component Signup
 * @description The Signup component for user registration.
 * @param {LoginProps} handleLogin - The login function passed as a prop.
 * @param {LoginProps} handleSignup - The signup function passed as a prop.
 * @returns {React.FC} A React functional component.
 */
const Signup: React.FC<LoginProps>= ({ handleLogin, handleSignup }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordAgain, setPasswordAgain] = useState<string>('');
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [showRequestVerificationModal, setShowRequestVerificationModal] = useState(false);

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
          // Check if the loading state is true, if yes, return early
    if (loading) {
      return;
    }
      try {
        setLoading(true); // Set loading state to true when starting the login process
        await signupUser(email, password); // Call the signupUser function
        Toast.show({
          title: 'Success',
          variant: "subtle",
          description: "Success', 'Verification link has been sent to your email",
        });
        navigation.navigate('Login');
      } catch (error) {
        // Display the custom error message from the server
        Toast.show({
          title: 'Error',
          variant: "subtle",
          description: error.message,
          duration: 4000,
        });
      }
    }
  };

  /**
   * Handles the login button press.
   * Navigates to the Login screen.
   */
  const handleLoginPress = () => {
    setLoading(false);
    navigation.navigate('Login')
  }

  return (
    <Center w="100%" flex={1} px="3" background="#fafafa">
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
      {t('signup')}
      </Heading>
      {loading && 
      <HStack space={8} justifyContent="center" alignItems="center" mb={2}>
      <Spinner accessibilityLabel="Loading" size={'lg'} color={"orange.400"}/>
      <Heading color="orange.400" fontSize="lg">
        Loading
      </Heading>
      </HStack>
      }
        <TextInput
          placeholder="Email"
          value={email}
          style={styles.input}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <TextInput
          placeholder={t('pwPlaceHolder')}
          value={password}
          style={styles.input}
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          placeholder={t('pwAgain')}
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
          {t('register')}
        </Button>
        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14, paddingTop: 2 }}>
        {t('alreadyUser')}{' '}
        </Text>
        <TouchableOpacity onPress={handleLoginPress} style={{marginLeft: -2 }}>
          <Text style={{ color: '#EF6F20', fontWeight: '600', fontSize: 14 }}>
            {' '}
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowRequestVerificationModal(true)} style={{marginLeft: -2 }}>
          <Text style={{ color: '#EF6F20', fontWeight: '600', fontSize: 14 }}>
            {' '}
            {t('noLink')}
          </Text>
        </TouchableOpacity>
      </Box>
      <Box
        w="100%"
        position="absolute"
        height="82%"
        bottom="0"
        background="#242424"
        opacity="100"
        roundedTopLeft="20"
        zIndex="-10"
      ></Box>
            <RequestVerification 
        isOpen={showRequestVerificationModal}
        onClose={() => setShowRequestVerificationModal(false)}
        requestVerification={verificationLink}
      />
    </Center>
  );
};

export default Signup;
