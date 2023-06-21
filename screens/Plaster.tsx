import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import styles from '../src/styles/style';
import { plasterOptions } from '../src/data/plasterMockData';
import api from '../service/api';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';

const Plaster: React.FC = () => {
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [brand, setBrand] = useState<string>(plasterOptions[0].value);
  const [squareMeters, setSquareMeters] = useState<string>('');
  const [plasterAmount, setPlasterAmount] = useState<string>('');

  const selectedOption = plasterOptions.find(
    (option) => option.value === brand
  );
  const consumption = selectedOption ? selectedOption.consumption : 0;

  const calculateConsumption = () => {
    const sqm = parseFloat(squareMeters);
    const result = consumption * sqm;
    setPlasterAmount(result.toFixed(2));
  };

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

  const addButtonPressed = async () => {
    if (lists.length === 0) {
      setShowModal(true);
      return;
    }
    const newItem: Omit<ShoppingItem, '_id'> = {
      amount: 0,
      content: {
        name: `${brand}`,
        amount: parseFloat(plasterAmount),
        unit: 'kg',
      },
    };
    try {
      const response = await makeAuthenticatedRequest(
        `${api.lists}/${lists[currentListIndex]?._id}/items`,
        'POST',
        { content: newItem.content }
      );
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
    const message = `${newItem.content.name} ${newItem.content.amount} kg lisätty listalle`;

    Alert.alert(message, 'Siirrytäänkö listalle?', [
      {
        text: 'Ei',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'Kyllä', onPress: () => navigateToShoppingList() }
    ]);
  };

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="80%">
        <Text color="#fafafa">Tasoite laskuri</Text>
        <Select
          bg="white"
          selectedValue={brand}
          minWidth="200"
          accessibilityLabel="Valikoi tuote"
          placeholder="Valikoi tuote"
          _selectedItem={{
            bg: 'orange.500',
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={(itemValue) => setBrand(itemValue)}
        >
          {plasterOptions.map((option) => (
            <Select.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select>
        <Text mt="2" mb="2" color="#fafafa">
          Syötä alue (m²):
        </Text>
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setSquareMeters(text)}
          value={squareMeters}
          keyboardType="numeric"
          placeholder="Syötä m²"
        />
        <Button
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
          onPress={calculateConsumption}
        >
          Laske
        </Button>
        {plasterAmount !== '' && (
          <Text mt="2" color="#fafafa">
            Tasoite määrä: {plasterAmount} kg
          </Text>
        )}
        <Text mt="2" color="#fafafa">
          Huomioi materiaalihukka! Laskelma on vain arvio menekistä eikä siinä
          huomioida olosuhteita tai ainehukkaa.
        </Text>
        <ShoppingListSelect
          lists={lists}
          currentListIndex={currentListIndex}
          setCurrentListIndex={setCurrentListIndex}
        />
        <Button onPress={() => setShowModal(true)} colorScheme="orange"
         _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
        >Uusi lista</Button>
        <Button
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
          onPress={addButtonPressed}
        >
          Lisää Listaan
        </Button>
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
        <CreateListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        createNewList={createNewList}
      />
    </Center>
  );
};

export default Plaster;
