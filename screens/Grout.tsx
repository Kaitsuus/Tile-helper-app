import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, Keyboard } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { groutOptions } from '../src/data/groutMockData';
import styles from '../src/styles/style';
import api from '../service/api';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';

const Grout: React.FC = () => {
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showModal, setShowModal] = useState(false);
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [brand, setBrand] = useState<string>(groutOptions[0].value);
  const [groutResult, setGroutResult] = useState<string>('');
  const [totalResult, setTotalResult] = useState<string>('');
  const [A, setA] = useState<string>(''); // tile height mm
  const [B, setB] = useState<string>(''); // tile width mm
  const [C, setC] = useState<string>(''); // tile thickness mm
  const [D, setD] = useState<string>(''); // grout width mm
  const [E, setE] = useState<string>(''); // area m²

  const selectedOption = groutOptions.find((option) => option.value === brand);
  const consumption = selectedOption ? selectedOption.consumption : 0;

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
          {groutOptions.map((option) => (
            <Select.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select>
        <Text mt="2" mb="2" color="#fafafa">
          Syötä laatan mitat (mm) ja sauman leveys (mm)
        </Text>
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setA(text)}
          value={A}
          keyboardType="numeric"
          placeholder="Laatan pituus (mm)"
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setB(text)}
          value={B}
          keyboardType="numeric"
          placeholder="Laatan leveys (mm)"
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setC(text)}
          value={C}
          keyboardType="numeric"
          placeholder="Laatan paksuus (mm)"
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setD(text)}
          value={D}
          keyboardType="numeric"
          placeholder="Sauman leveys (mm)"
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={(text) => setE(text)}
          value={E}
          keyboardType="numeric"
          placeholder="Saumattava alue (m²)"
        />
        <Button
          onPress={calculateConsumption}
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
        >
          Laske
        </Button>
        {groutResult !== '' && (
          <Text mt="2" color="#fafafa" fontSize="lg">
            Menekki: {groutResult} kg/m²
          </Text>
        )}
        {groutResult !== '' && (
          <Text color="#fafafa" fontSize="lg">
            Menekki: {totalResult} kg/{E}m²
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
          onPress={addButtonPressed}
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
        >
          Lisää listaan
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

export default Grout;
