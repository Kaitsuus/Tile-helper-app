import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles/style';
import { adhesiveOptions } from '../src/data/adhesiveData';
import mockData from '../src/data/mockData.json'

import { RootStackParamList, HomeScreenNavigationProp } from '../src/types'







const Adhesive: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigateToShoppingList = () => {
    navigation.navigate('ShoppingList');
  };

  const [brand, setBrand] = useState<string>(adhesiveOptions[0].value);
  const [thickness, setThickness] = useState<string>('3.5');
  const [squareMeters, setSquareMeters] = useState<string>('');
  const [adhesiveAmount, setAdhesiveAmount] = useState<string>('');

  const currentUserIndex = 0; // Index of the current user (hardcoded for now)

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

  const addButtonPressed = () => {
    const user = mockData.users[currentUserIndex];
    const newItem = {
      name: `${brand} ${adhesiveAmount}`,
      amount: parseFloat(adhesiveAmount),
      unit: 'kg',
    };
    user.shoppingList.push(newItem);
    const message = `${newItem.name} kg lisätty listalle`
    
    Alert.alert(
      message,
      '',
      [
        {
          text: "Ei",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Kyllä", onPress: () => navigateToShoppingList()}
      ]
    );
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
            bg: "orange.500",
            endIcon: <CheckIcon size="5" />,
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
            bg: "orange.500",
            endIcon: <CheckIcon size="5" />,
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
          _text={{ fontSize: "xl", fontWeight: 'bold' }}
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
          Huomioi materiaalihukka! Laskelma on vain arvio menekistä eikä siinä huomioida olosuhteita tai ainehukkaa.
        </Text>
        <Button
          colorScheme="orange"
          _text={{ fontSize: "xl", fontWeight: 'bold' }}
          mt="2"
          onPress={addButtonPressed}
        >
          Lisää listaan
        </Button>
      </Box>
      <Box w="100%" position="absolute" height="85%" bottom="0" background="#242424" opacity="100" roundedTopLeft="20" zIndex="-10"></Box>
    </Center>
  );
};

export default Adhesive;
