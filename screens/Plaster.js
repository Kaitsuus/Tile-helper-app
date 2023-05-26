import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import styles from '../src/styles/style'
import { plasterOptions } from '../src/data/plasterData';

const Plaster = () => {
  const [brand, setBrand] = useState(plasterOptions[0].value);
  const [squareMeters, setSquareMeters] = useState('');
  const [plasterAmount, setPlasterAmount] = useState('');

  const selectedOption = plasterOptions.find((option) => option.value === brand);
  const consumption = selectedOption ? selectedOption.consumption : 0;

  const calculateConsumption = () => {
    const sqm = parseFloat(squareMeters);
    const result = consumption * sqm;
    setPlasterAmount(result.toFixed(2));
  };

  const addButtonPressed = () => {
    const message = `${brand} ${plasterAmount}kg lisätty listalle`;
    Alert.alert(message);
  };

  return (
    <Center w="100%" flex={1} px="3" background='#000'>
    <Box safeArea p="2" py="8" w="90%" maxW="290">
      <Text color='#fafafa'>Tasoite laskuri</Text>
      <Select bg="white" selectedValue={brand} minWidth="200" accessibilityLabel="Valikoi tuote" placeholder="Valikoi tuote" _selectedItem={{
        bg: "orange.500",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setBrand(itemValue)}>
      {plasterOptions.map((option) => (
          <Select.Item 
            key={option.value}
            label={option.label}
            value={option.value}
           />
        ))}
        </Select> 
      <Text mt="2" mb="2" color='#fafafa'>Syötä alue (m²):</Text>
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
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
        onPress={calculateConsumption}
      >Laske</Button>
      {plasterAmount !== '' && (
        <Text mt="2" color='#fafafa'>Tasoite määrä: {plasterAmount} kg</Text>
      )}
      <Text mt="2" color='#fafafa'>Huomioi materiaalihukka! Laskelma on vain arvio menekistä eikä siinä huomioida olosuhteita tai ainehukkaa.</Text>
      <Button
        colorScheme="orange"
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
        onPress={addButtonPressed}
      >Lisää Listaan</Button>
    </Box>
    </Center>
  );
};

export default Plaster;