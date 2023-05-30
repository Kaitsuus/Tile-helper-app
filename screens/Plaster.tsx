import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import styles from '../src/styles/style';
import { plasterOptions } from '../src/data/plasterMockData';
import mockData from '../src/data/mockData.json'

const Plaster: React.FC = () => {
  const [brand, setBrand] = useState<string>(plasterOptions[0].value);
  const [squareMeters, setSquareMeters] = useState<string>('');
  const [plasterAmount, setPlasterAmount] = useState<string>('');

  const currentUserIndex = 0; // Index of the current user (hardcoded for now)

  const selectedOption = plasterOptions.find((option) => option.value === brand);
  const consumption = selectedOption ? selectedOption.consumption : 0;

  const calculateConsumption = () => {
    const sqm = parseFloat(squareMeters);
    const result = consumption * sqm;
    setPlasterAmount(result.toFixed(2));
  };

  const addButtonPressed = () => {
    const user = mockData.users[currentUserIndex];
    const newItem = {
      name: `${brand} ${plasterAmount}`,
      amount: parseFloat(plasterAmount),
      unit: 'kg',
    };
    user.shoppingList.push(newItem);
    Alert.alert(`${newItem.name}${newItem.unit} lisätty listalle`);
    console.log(user)
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
            bg: "orange.500",
            endIcon: <CheckIcon size="5" />,
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
          _text={{ fontSize: "xl", fontWeight: 'bold' }}
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
          Huomioi materiaalihukka! Laskelma on vain arvio menekistä eikä siinä huomioida olosuhteita tai ainehukkaa.
        </Text>
        <Button
          colorScheme="orange"
          _text={{ fontSize: "xl", fontWeight: 'bold' }}
          mt="2"
          onPress={addButtonPressed}
        >
          Lisää Listaan
        </Button>
      </Box>
      <Box w="100%" position="absolute" height="85%" bottom="0" background="#242424" opacity="100" roundedTopLeft="20" zIndex="-10"></Box>
    </Center>
  );
};

export default Plaster;
