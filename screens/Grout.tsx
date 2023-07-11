import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, TouchableOpacity } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { groutOptions } from '../src/data/groutMockData';
import styles from '../src/styles/style';
import api from '../service/api';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';
import InfoModal from '../src/components/InfoModal';
import { useTranslation } from 'react-i18next';

/**
 * Grout is a React functional component used for grout calculations.
 * It provides UI to select grout product, enter tile measurements and grout width,
 * perform calculation of grout consumption and total consumption, and add the calculated amount to shopping lists.
 * Users can also create new shopping lists from this component.
 * @component
 */

const Grout: React.FC = () => {

  /**
   * @typedef {Object} State
   * @property {boolean} showModal - State for managing visibility of the modal.
   * @property {ShoppingItem[]} items - State for managing shopping items.
   * @property {ShoppingList[]} lists - State for managing shopping lists.
   * @property {string} brand - State for managing the selected grout brand.
   * @property {string} groutResult - State for managing the calculated grout consumption.
   * @property {string} totalResult - State for managing the total calculated grout consumption.
   * @property {string} A - State for managing tile height in mm.
   * @property {string} B - State for managing tile width in mm.
   * @property {string} C - State for managing tile thickness in mm.
   * @property {string} D - State for managing grout width in mm.
   * @property {string} E - State for managing tile area in m².
   */

  const { t } = useTranslation();
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [brand, setBrand] = useState<string>(groutOptions[0].value);
  const [groutResult, setGroutResult] = useState<string>('');
  const [totalResult, setTotalResult] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [A, setA] = useState<string>(''); // tile height mm
  const [B, setB] = useState<string>(''); // tile width mm
  const [C, setC] = useState<string>(''); // tile thickness mm
  const [D, setD] = useState<string>(''); // grout width mm
  const [E, setE] = useState<string>(''); // area m²
  
  /**
   * Navigate to the ShoppingList screen.
   */
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };

  const selectedOption = groutOptions.find((option) => option.value === brand);
  const consumption = selectedOption ? selectedOption.consumption : 0;

  /**
   * Calculate the consumption of grout and total consumption based on the user's input.
   */
  const calculateConsumption = () => {
    const a = parseFloat(A);
    const b = parseFloat(B);
    const c = parseFloat(C);
    const d = parseFloat(D);
    const e = parseFloat(E);
    const result = ((a + b) / (a * b)) * c * d * consumption;
    const total = result * e;
    setGroutResult(result.toFixed(2));
    setTotalResult(total.toFixed(2));
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
        name: `${brand} ${color}`,
        amount: parseFloat(totalResult),
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
      <Box flexDirection="row" marginBottom={2}>
      <Select
        bg="white"
        selectedValue={brand}
        minWidth="190"
        accessibilityLabel={t('productLabel')}
        placeholder={t('productLabel')}
        _selectedItem={{
          bg: 'orange.500',
          endIcon: <CheckIcon size="5" />
        }}
        mt={1}
        onValueChange={(itemValue) => setBrand(itemValue)}
      >
        {groutOptions.map((option) => (
          <Select.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Select>
      <Box width={2} />
      <Select
        bg="white"
        pr={2}
        selectedValue={color}
        minWidth="75"
        accessibilityLabel='color'
        placeholder='color'
        _selectedItem={{
          bg: 'orange.500',
          endIcon: <CheckIcon size="5" />
        }}
        mt={1}
        onValueChange={(itemValue) => setColor(itemValue)}
      >
        {groutOptions.find((option) => option.value === brand)?.color.map((colorOption) => (
          <Select.Item
            key={colorOption}
            label={colorOption}
            value={colorOption}
          />
        ))}
      </Select>
    </Box>
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setA(text)}
          value={A}
          keyboardType="numeric"
          placeholder={t('tileH')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setB(text)}
          value={B}
          keyboardType="numeric"
          placeholder={t('tileW')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setC(text)}
          value={C}
          keyboardType="numeric"
          placeholder={t('tileT')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setD(text)}
          value={D}
          keyboardType="numeric"
          placeholder={t('groutW')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setE(text)}
          value={E}
          keyboardType="numeric"
          placeholder={t('groutArea')}
        />
        <Button
          onPress={calculateConsumption}
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
          mb="1"
        >
          {t('calc')}
        </Button>
        {groutResult !== '' && (
          <Text mt="2" color="#fafafa" fontSize="lg">
            {t('consumption')} {groutResult} kg/m²
          </Text>
        )}
        {groutResult !== '' && (
          <Text color="#fafafa" fontSize="lg">
            {t('consumption')} {totalResult} kg/{E}m²
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

export default Grout;
