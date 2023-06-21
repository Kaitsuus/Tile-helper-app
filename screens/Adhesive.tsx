import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { adhesiveOptions } from '../src/data/adhesiveMockData';
import api from '../service/api';
import { fetchAndTransformLists, makeAuthenticatedRequest } from '../service/auth';
import { ShoppingList, ShoppingItem, HomeScreenNavigationProp } from '../src/types'

const Adhesive: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [brand, setBrand] = useState<string>(adhesiveOptions[0].value);
  const [thickness, setThickness] = useState<string>('3.5');
  const [squareMeters, setSquareMeters] = useState<string>('');
  const [adhesiveAmount, setAdhesiveAmount] = useState<string>('');
  const [currentListIndex, setCurrentListIndex] = useState<string>('0');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transformedLists = await fetchAndTransformLists();
        setLists(transformedLists);
      } catch (error) {
        console.error('Error while fetching lists:', error);
      }
    };
    fetchData();
  }, []);


  const calculateConsumption = () => {
    const sqm = parseFloat(squareMeters);
    let consumption = 0;

    switch (thickness) {
      case '3.5':
        consumption = 1.6;
        break;
      case '6':
        consumption = 2.1;
        break;
      case '10':
        consumption = 3.2;
        break;
      default:
        consumption = 0;
    }

    const result = consumption * sqm;
    setAdhesiveAmount(result.toFixed(2));
  };

  const addButtonPressed = async () => {
    const newItem: Omit<ShoppingItem, '_id'> = {
      amount: 0,
      content: {
        name: `${brand} ${adhesiveAmount}`,
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
    } catch (error) {
      console.error('Error adding item to the list:', error);
    }
    const message = `${newItem.content.name} kg lisätty listalle`;

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
        <Text mt="2" mb="2" color="#fafafa">
          Kiinnityslaasti Laskuri
        </Text>
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
          {adhesiveOptions.map((option) => (
            <Select.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select>
        <Text mt="2" mb="2" color="#fafafa">
          Valikoi hammastus:
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
          <Select.Item label="3.5 mm" value="3.5" />
          <Select.Item label="6 mm" value="6" />
          <Select.Item label="10 mm" value="10" />
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
        {adhesiveAmount !== '' && (
          <Text mt="2" color="#fafafa">
            Laasti määrä: {adhesiveAmount} kg
          </Text>
        )}
        <Text mt="2" color="#fafafa">
          Huomioi materiaalihukka! Laskelma on vain arvio menekistä eikä siinä
          huomioida olosuhteita tai ainehukkaa.
        </Text>
        <Select
          bg="white"
          selectedValue={currentListIndex}
          _selectedItem={{
            bg: 'orange.500',
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={(value) => setCurrentListIndex(value)}
        >
          {lists.length > 0 ? (
            lists.map((list: ShoppingList, index: number) => (
              <Select.Item key={list._id} label={list.title} value={index.toString()} />
            ))
          ) : (
            <Select.Item label="No lists available" value="" />
          )}
        </Select>
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
        opacity="100"
        roundedTopLeft="20"
        zIndex="-10"
      ></Box>
    </Center>
  );
};

export default Adhesive;
