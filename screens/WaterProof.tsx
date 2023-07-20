import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, TouchableOpacity } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import { MaterialIcons } from '@expo/vector-icons';
import { waterproofOptions } from '../src/data/waterproofMockData';
import styles from '../src/styles/style';
import api from '../service/api';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';
import { useTranslation } from 'react-i18next';
import InfoModal from '../src/components/InfoModal';

/**
 * Waterproof is a React functional component used for waterproof calculations.
 * It provides UI to select waterproof product, enter are dimensions,
 * perform calculation of waterproof consumption and total consumption, and add the calculated amount to shopping lists.
 * Users can also create new shopping lists from this component.
 * @component
 */

const WaterProof: React.FC = () => {

  /**
   * @typedef {Object} State
   * @property {boolean} showModal - State for managing visibility of the modal.
   * @property {boolean} showInfoModal - State for managing visibility of the modal.
   * @property {ShoppingItem[]} items - State for managing shopping items.
   * @property {ShoppingList[]} lists - State for managing shopping lists.
   * @property {string} brand - State for managing the selected waterproof brand.
   * @property {string} floorlitre - State for managing the floor's litre state.
   * @property {string} wallLitre - State for managing the wall's litre state.
   * @property {string} floorTimes - State for managing the floor's times state.
   * @property {string} wallTimes - State for managing the wall's times state.
   * @property {number} floorKilos - State for managing the floor's kilos state.
   * @property {number} wallKilos - State for managing the wall's kilos state.
   * @property {number} floorLitres - State for managing the floor's litres state.
   * @property {number} wallLitres - State for managing the wall's litres state.
   * @property {number} qty - State for managing the quantity state.
   */

  const { t } = useTranslation();
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [brand, setBrand] = useState<string>(waterproofOptions[0].value);
  const [floorlitre, setFloorlitre] = useState<string>('');
  const [wallLitre, setWallLitre] = useState<string>('');
  const [floorTimes, setFloorTimes] = useState<string>('');
  const [wallTimes, setWallTimes] = useState<string>('');
  const [floorKilos, setFloorKilos] = useState<number>(0);
  const [wallKilos, setWallKilos] = useState<number>(0);
  const [floorLitres, setFloorLitres] = useState<number>(0);
  const [wallLitres, setWallLitres] = useState<number>(0);
  const [qty, setQty] = useState<number>(0);

  /**
   * @typedef {Object} LocalVariables
   * @property {Option | undefined} selectedOption - The selected option from waterproof options.
   * @property {number} consumptionWL - The consumption for wall litre.
   * @property {number} consumptionWKg - The consumption for wall kilogram.
   * @property {number} consumptionFL - The consumption for floor litre.
   * @property {number} consumptionFKg - The consumption for floor kilogram.
   */
  
  const selectedOption = waterproofOptions.find(
    (option) => option.value === brand
    );
    const consumptionWL = selectedOption ? selectedOption.consumptionWL : 0;
    const consumptionWKg = selectedOption ? selectedOption.consumptionWKg : 0;
    const consumptionFL = selectedOption ? selectedOption.consumptionFL : 0;
    const consumptionFKg = selectedOption ? selectedOption.consumptionFKg : 0;

  /**
   * Navigate to the ShoppingList screen.
   */
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };

  /**
   * calculateKilogrammat function calculates the total amount of waterproof needed for floors and walls.
   */
  const calculateKilogrammat = () => {
    const floorsLitres = parseFloat(floorlitre);
    const wallsLitres = parseFloat(wallLitre);
    const floorsTimes = parseInt(floorTimes);
    const wallsTimes = parseInt(wallTimes);

    const floorKg = isNaN(floorsLitres)
      ? 0
      : floorsLitres * consumptionFKg * floorsTimes;
    const wallKg = isNaN(wallsLitres)
      ? 0
      : wallsLitres * consumptionWKg * wallsTimes;
    const floorL = isNaN(floorsLitres)
      ? 0
      : floorsLitres * consumptionFL * floorsTimes;
    const wallL = isNaN(wallsLitres)
      ? 0
      : wallsLitres * consumptionWL * wallsTimes;
    const totalLQty = floorL + wallL;

    setFloorKilos(parseFloat(floorKg.toFixed(2)));
    setWallKilos(parseFloat(wallKg.toFixed(2)));
    setFloorLitres(parseFloat(floorL.toFixed(2)));
    setWallLitres(parseFloat(wallL.toFixed(2)));
    setFloorTimes(isNaN(floorsTimes) ? '0' : floorsTimes.toString());
    setWallTimes(isNaN(wallsTimes) ? '0' : wallsTimes.toString());
    setQty(parseFloat(totalLQty.toFixed(2)));
  };

  /**
   * fetchLists function fetches the shopping lists from the server.
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
   * createNewList function creates a new shopping list on the server.
   * @param {string} title - The title of the new list.
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
   * addButtonPressed function adds the calculated waterproof amount to the selected shopping list.
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
        amount: (qty),
        unit: 'l',
      },
    };
    try {
      const response = await makeAuthenticatedRequest(
        `${api.lists}/${lists[currentListIndex]?._id}/items`,
        'POST',
        { content: newItem.content }
      );
      const message = `${newItem.content.name} ${newItem.content.amount} ${newItem.content.unit} ${t('addedToList')}`;
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

  /**
   * Handles changes to the floor litre input.
   *
   * @param {string} text - The new text in the floor litre input.
   */
  const handleFloorlitreChange = (text: string) => {
    const newValue = parseFloat(text);
    if (!isNaN(newValue) && newValue !== parseFloat(floorlitre)) {
      setFloorlitre(text);
    }
  };

  /**
   * Handles changes to the wall litre input.
   *
   * @param {string} text - The new text in the wall litre input.
   */
  const handleWallLitreChange = (text: string) => {
    const newValue = parseFloat(text);
    if (!isNaN(newValue) && newValue !== parseFloat(wallLitre)) {
      setWallLitre(text);
    }
  };

  /**
   * Handles changes to the floor times input.
   *
   * @param {string} text - The new text in the floor times input.
   */
  const handleFloorTimesChange = (text: string) => {
    const newValue = parseInt(text);
    if (!isNaN(newValue) && newValue !== parseInt(floorTimes)) {
      setFloorTimes(text);
    }
  };

  /**
   * Handles changes to the wall times input.
   *
   * @param {string} text - The new text in the wall times input.
   */
  const handleWallTimesChange = (text: string) => {
    const newValue = parseInt(text);
    if (!isNaN(newValue) && newValue !== parseInt(wallTimes)) {
      setWallTimes(text);
    }
  };

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="65%">
        <Select
          bg="white"
          selectedValue={brand}
          minWidth={200}
          accessibilityLabel={t('productLabel')}
          placeholder={t('productLabel')}
          _selectedItem={{
            bg: 'orange.500',
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={(itemValue) => setBrand(itemValue)}
        >
          {waterproofOptions.map((option) => (
            <Select.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select>
        <Text mt="2" mb="2" color="#fafafa">
        {t('areInput')}
        </Text>
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleFloorlitreChange}
          value={floorlitre.toString()}
          keyboardType="numeric"
          placeholder={t('floorPh')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleWallLitreChange}
          value={wallLitre.toString()}
          keyboardType="numeric"
          placeholder={t('wallPh')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleFloorTimesChange}
          value={floorTimes.toString()}
          keyboardType="numeric"
          placeholder={t('floorTimes')}
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleWallTimesChange}
          value={wallTimes.toString()}
          keyboardType="numeric"
          placeholder={t('wallTimes')}
        />
        <Button
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
          onPress={calculateKilogrammat}
        >
          {t('calc')}
        </Button>
        {parseInt(floorTimes) !== 0 && (
          <Text mt="2" color="#fafafa">
            {t('floorTimesTxt')} {floorTimes}
          </Text>
        )}
        {parseInt(wallTimes) !== 0 && (
          <Text color="#fafafa">{t('wallTimesTxt')} {wallTimes}</Text>
        )}
        {floorKilos !== 0 && (
          <Text mt="2" color="#fafafa">
            {t('floorConsumption')} {floorKilos}kg / {floorLitres}l
          </Text>
        )}
        {wallKilos !== 0 && (
          <Text color="#fafafa">
            {t('wallConsumption')} {wallKilos}kg / {wallLitres}l
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
        opacity={100}
        roundedTopLeft={20}
        zIndex={-10}
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

export default WaterProof;
