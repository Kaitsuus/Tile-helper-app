import React, { useState, useEffect } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { MaskedTextInput } from 'react-native-mask-text';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { adhesiveOptions } from '../src/data/adhesiveMockData';
import api from '../service/api';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';
import { useTranslation } from 'react-i18next';
import InfoModal from '../src/components/InfoModal';

/**
 * Adhesive is a React functional component used for adhesive calculations.
 * It provides UI to select adhesive product and throwel, user input for squaremeters,
 * perform calculation of adhesive consumption and total consumption, and add the calculated amount to shopping lists.
 * Users can also create new shopping lists from this component.
 * @component
 */

const Adhesive: React.FC = () => {

  /**
   * @typedef {Object} State
   * @property {boolean} showModal - State for managing visibility of the modal.
   * @property {ShoppingItem[]} items - State for managing shopping items.
   * @property {ShoppingList[]} lists - State for managing shopping lists.
   * @property {string} brand - State for managing the selected adhesive brand.
   * @property {string} squareMeters - State for managing the squareMeters to calculate adhesive consumption.
   * @property {string} adhesiveAmount - State for managing the total calculated adhesive consumption.
   * @property {string} thickness - State for managing throwel thickness in mm.
   */

  const { t } = useTranslation();
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [brand, setBrand] = useState<string>(adhesiveOptions[0].value);
  const [thickness, setThickness] = useState<string>('');
  const [squareMeters, setSquareMeters] = useState<string>('');
  const [adhesiveAmount, setAdhesiveAmount] = useState<string>('');

  /**
   * Navigate to the ShoppingList screen.
   */
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };

  /**
   * Fetch the shopping lists from the server.
   */
  const fetchLists = async () => {
    try {
      const transformedLists = await fetchAndTransformLists();
      setLists(transformedLists);
    } catch (error) {
      console.error('Error while fetching lists:', error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);
  
  useEffect(() => {
    if (lists.length > 0) {
      setItems(lists[currentListIndex]?.items || []);
    }
  }, [lists, currentListIndex]);
  
  useEffect(() => {
    if (lists.length > 0) {
      setItems(lists[currentListIndex]?.items || []);
    }
  }, [lists, currentListIndex]);

  /**
   * Create a new shopping list with the given title.
   * @param {string} title - The title of the new shopping list.
   */
  const createNewList = async (title: string) => {
    try {
      const newList = {
        title,
        items: [],
      };
      const response = await makeAuthenticatedRequest(`${api.lists}`, 'POST', newList);
      const createdList = response.data;
      setLists([...lists, createdList]);
      setCurrentListIndex((lists.length).toString());
      fetchLists();
    } catch (error) {
      console.error('Error creating new list:', error);
    }
  };

  /**
   * Calculate the consumption of adhesive and total consumption based on the user's input.
   */
  const calculateConsumption = () => {
    const sqm = parseFloat(squareMeters);
    let consumption = 0;
  
    const selectedAdhesive = adhesiveOptions.find((option) => option.value === brand);
    const selectedThicknessOption = selectedAdhesive?.thicknessOptions.find(
      (option) => option.thickness === thickness
    );
  
    if (selectedThicknessOption) {
      consumption = selectedThicknessOption.consumption;
    }
  
    const result = consumption * sqm;
    setAdhesiveAmount(result.toFixed(2));
  };

  /**
   * Add a new shopping item to the current shopping list.
   * If no shopping list is selected, it prompts the user to create a new one.
   */
  const addButtonPressed = async () => {
    if (lists.length === 0) {
      setShowModal(true);
      return;
    }
    const newItem: Omit<ShoppingItem, '_id'> = {
      amount: 0,
      content: {
        name: `${brand}`,
        amount: parseFloat(adhesiveAmount),
        unit: 'kg',
      },
    };
    try {
      const response = await makeAuthenticatedRequest(
        `${api.lists}/${lists[currentListIndex]?._id}/items`,
        'POST',
        { content: newItem.content }
      );
      const message = `${newItem.content.name} ${newItem.content.amount} ${t('kgToList')}`;
  
      Alert.alert(message, t('toList'), [
        {
          text: t('no'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: t('yes'), onPress: () => navigateToShoppingList() }
      ]);
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
  };

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="65%">
        <Text mt="2" mb="2" color="#fafafa">
        {t('adhesiveCalc')}
        </Text>
        <Select
          bg="white"
          selectedValue={brand}
          minWidth="200"
          accessibilityLabel={t('productLabel')}
          placeholder={t('productLabel')}
          _selectedItem={{
            bg: 'orange.500',
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={(itemValue) => setBrand(itemValue)}
        >
          {adhesiveOptions.map((option) => (
            <Select.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select>
        <Text mt="2" mb="2" color="#fafafa">
        {t('throwel')}
        </Text>
        <Select
          bg="white"
          selectedValue={thickness}
          minWidth="200"
          accessibilityLabel="Choose Service"
          placeholder="Choose Service"
          _selectedItem={{
            bg: 'orange.500',
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={(itemValue) => setThickness(itemValue)}
        >
          {adhesiveOptions
            .find((option) => option.value === brand)
            ?.thicknessOptions.map((option) => (
              <Select.Item
                key={option.thickness}
                label={option.label}
                value={option.thickness} // Use `option.thickness` instead of `option.value`
              />
            ))}
        </Select>
        <Text mt="2" mb="2" color="#fafafa">
        {t('areInput')}
        </Text>
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setSquareMeters(text)}
          value={squareMeters}
          keyboardType="numeric"
          placeholder={t('areInput')}
        />
        <Button
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2" mb="1"
          onPress={calculateConsumption}
        >
          {t('calc')}
        </Button>
        {adhesiveAmount !== '' && (
          <Text mt="2" color="#fafafa">
            {t('adhesiveAmount')} {adhesiveAmount} kg
          </Text>
        )}
        <ShoppingListSelect
          lists={lists}
          currentListIndex={currentListIndex}
          setCurrentListIndex={setCurrentListIndex}
        />
        <Button.Group>
            <Button onPress={addButtonPressed}
          colorScheme="orange"
          _text={{ fontSize: 'lg', fontWeight: 'bold' }}
          mt="2" flex={1}>
            {t('addToList')}
            </Button>
            <Button
              onPress={() => setShowModal(true)} colorScheme="orange"
              _text={{ fontSize: 'lg', fontWeight: 'bold' }}
               mt="2" flex={1}
            >
              {t('newList')}
            </Button>
          </Button.Group>
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
      >
        <TouchableOpacity onPress={() => setShowInfoModal(true)}>
          <Box position="absolute" top={1} right={1} p={2}>
            <MaterialIcons name="info-outline" size={24} color="orange" />
          </Box>
        </TouchableOpacity>
      </Box>
        <CreateListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        createNewList={createNewList}
      />
      <InfoModal 
      isOpen={showInfoModal}
      onClose={() => setShowInfoModal(false)}
      />
    </Center>
  );
};

export default Adhesive;
