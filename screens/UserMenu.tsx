/**
 * @module UserMenu
 * @description This module exports the UserMenu component which is used to render the user menu screen of the app.
 */

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, Avatar, Box, Text, Select, CheckIcon, Button } from 'native-base';
import { useUserContext } from '../service/UserContext';
import { useAuth } from '../service/AuthContext';
import { deleteUserFromDB } from '../service/auth';
import DeleteUserModal from '../src/components/DeleteUserModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @function UserMenu
 * @description This is the functional component for the UserMenu screen.
 * @returns {React.FC} A React functional component.
 */
const UserMenu: React.FC = () => {
  /**
   * @typedef {Object} State
   * @property {boolean} showModal - The state for showing/hiding the delete user modal.
   * @property {Object} userData - The user data obtained from the UserContext.
   * @property {string} preffLang - The user's language preference.
   * @var {Object} setUser - Function from AuthContext to set the user state.
   */

  const [showModal, setShowModal] = useState(false);
  const { userData } = useUserContext();
  const [preffLang, setPreffLang] = useState(userData.languagePreference);
  const { setUser } = useAuth();

  /**
   * @function handleLogout
   * @description Handles the logout process by setting the user state to false.
   */
  const handleLogout = () => {
    setUser(false);
  };

  /**
   * @function deleteUser
   * @description Deletes the user from the database and clears user data from AsyncStorage.
   * @param {string} userId - The ID of the user to be deleted.
   */
  const deleteUser = async (userId: string) => {
    try {
      await deleteUserFromDB(userId);
      await AsyncStorage.removeItem('userId'); // clear user data from AsyncStorage
      setUser(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Center w="100%" flex={1} px={3} background="#D9D9D9">
      <Avatar bg="#EF6F20" size="2xl" mt="40">
        {userData && userData.email ? userData.email[0].toUpperCase() : 'A'}
      </Avatar>
      <Text mt="2" fontSize="lg" color="#fafafa">
        {userData && userData.email ? userData.email : 'error while getting user'}
      </Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text color="#fafafa">Kirjaudu Ulos</Text>
      </TouchableOpacity>
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="63%">
        <Box flexDirection="row" alignItems="center" justifyContent="center">
          <Select
            bg="white"
            selectedValue={preffLang}
            minWidth="90"
            _selectedItem={{
              bg: 'orange.500',
              endIcon: <CheckIcon size={3} />,
            }}
            mt={1}
            onValueChange={(itemValue) => setPreffLang(itemValue)}
          >
            <Select.Item label="fi" value="fi" />
            <Select.Item label="en" value="en" />
            <Select.Item label="es" value="es" />
          </Select>
          <Button colorScheme="orange" marginLeft={2}>
            save
          </Button>
        </Box>
        <Button colorScheme="orange" _text={{ fontSize: 'lg', fontWeight: 'bold' }} mt={8}>
          Arvostele
        </Button>
        <Button colorScheme="orange" _text={{ fontSize: 'lg', fontWeight: 'bold' }} mt={2}>
          Tietosuoja
        </Button>
        <Button colorScheme="orange" _text={{ fontSize: 'lg', fontWeight: 'bold' }} mt={2}>
          Report Bug
        </Button>
        <Button onPress={() => setShowModal(true)} colorScheme="orange" _text={{ fontSize: 'lg', fontWeight: 'bold' }} mt={2}>
          Poista Tili
        </Button>
      </Box>
      <Box
        w="100%"
        position="absolute"
        height="75%"
        bottom="0"
        background="#242424"
        opacity="100"
        roundedTopLeft="20"
        zIndex="-10"
      ></Box>
      <DeleteUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        deleteUser={deleteUser}
        userId={userData.id}
      />
    </Center>
  );
};

export default UserMenu;
