import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import { waterproofOptions } from '../src/data/waterproofMockData';
import styles from '../src/styles/style';
import api from '../service/api';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'
import ShoppingListSelect from '../src/components/ShoppingListSelect';
import { useUserContext } from '../service/UserContext';
import CreateListModal from '../src/components/CreateListModal';

const WaterProof: React.FC = () => {
  const { currentListIndex, setCurrentListIndex } = useUserContext();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
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

  const selectedOption = waterproofOptions.find(
    (option) => option.value === brand
  );
  const consumptionWL = selectedOption ? selectedOption.consumptionWL : 0;
  const consumptionWKg = selectedOption ? selectedOption.consumptionWKg : 0;
  const consumptionFL = selectedOption ? selectedOption.consumptionFL : 0;
  const consumptionFKg = selectedOption ? selectedOption.consumptionFKg : 0;

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
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
    const message = `${newItem.content.name} ${newItem.content.amount} ${newItem.content.unit} lisätty listalle`;

    Alert.alert(message, 'Siirrytäänkö listalle?', [
      {
        text: 'Ei',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'Kyllä', onPress: () => navigateToShoppingList() }
    ]);
  };

  const handleFloorlitreChange = (text: string) => {
    const newValue = parseFloat(text);
    if (!isNaN(newValue) && newValue !== parseFloat(floorlitre)) {
      setFloorlitre(text);
    }
  };

  const handleWallLitreChange = (text: string) => {
    const newValue = parseFloat(text);
    if (!isNaN(newValue) && newValue !== parseFloat(wallLitre)) {
      setWallLitre(text);
    }
  };

  const handleFloorTimesChange = (text: string) => {
    const newValue = parseInt(text);
    if (!isNaN(newValue) && newValue !== parseInt(floorTimes)) {
      setFloorTimes(text);
    }
  };

  const handleWallTimesChange = (text: string) => {
    const newValue = parseInt(text);
    if (!isNaN(newValue) && newValue !== parseInt(wallTimes)) {
      setWallTimes(text);
    }
  };

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
      <Box safeArea p="2" py="8" w="90%" maxW="290" h="80%">
        <Select
          bg="white"
          selectedValue={brand}
          minWidth={200}
          accessibilityLabel="Valikoi tuote"
          placeholder="Valikoi tuote"
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
          Syötä pinta-alat m²
        </Text>
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleFloorlitreChange}
          value={floorlitre.toString()}
          keyboardType="numeric"
          placeholder="Anna lattioiden pinta-ala m²"
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleWallLitreChange}
          value={wallLitre.toString()}
          keyboardType="numeric"
          placeholder="Anna seinien pinta-ala m²"
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleFloorTimesChange}
          value={floorTimes.toString()}
          keyboardType="numeric"
          placeholder="Anna lattioiden levityskerrat"
        />
        <MaskedTextInput
          style={styles.input}
          mask="9999"
          onChangeText={handleWallTimesChange}
          value={wallTimes.toString()}
          keyboardType="numeric"
          placeholder="Anna seinien levityskerrat"
        />
        <Button
          colorScheme="orange"
          _text={{ fontSize: 'xl', fontWeight: 'bold' }}
          mt="2"
          onPress={calculateKilogrammat}
        >
          Laske
        </Button>
        {parseInt(floorTimes) !== 0 && (
          <Text mt="2" color="#fafafa">
            Lattioiden levityskerrat: {floorTimes}
          </Text>
        )}
        {parseInt(wallTimes) !== 0 && (
          <Text color="#fafafa">Seinien levityskerrat: {wallTimes}</Text>
        )}
        {floorKilos !== 0 && (
          <Text mt="2" color="#fafafa">
            Lattiat menekki {floorKilos}kg / {floorLitres}l
          </Text>
        )}
        {wallKilos !== 0 && (
          <Text color="#fafafa">
            Seinät menekki {wallKilos}kg / {wallLitres}l
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
          Lisää listaan
        </Button>
      </Box>
      <Box
        w="100%"
        position="absolute"
        height="85%"
        bottom="0"
        background="#242424"
        opacity={100}
        roundedTopLeft={20}
        zIndex={-10}
      ></Box>
        <CreateListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        createNewList={createNewList}
      />
    </Center>
  );
};

export default WaterProof;
