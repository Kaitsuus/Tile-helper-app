import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { MaskedTextInput } from 'react-native-mask-text';
import { waterproofOptions } from '../src/data/waterproofData';
import styles from '../src/styles/style'

const WaterProof = () => {
  const [brand, setBrand] = useState(waterproofOptions[0].value);
  const [floorlitre, setFloorlitre] = useState('');
  const [wallLitre, setWallLitre] = useState('');
  const [floorTimes, setFloorTimes] = useState('');
  const [wallTimes, setWallTimes] = useState('');
  const [floorKilos, setFloorKilos] = useState(0);
  const [wallKilos, setWallKilos] = useState(0);
  const [floorLitres, setFloorLitres] = useState(0);
  const [wallLitres, setWallLitres] = useState(0);
  const [qty, setQty] = useState(0);

  const selectedOption = waterproofOptions.find((option) => option.value === brand);
  const consumptionWL = selectedOption ? selectedOption.consumptionWL : 0;
  const consumptionWKg = selectedOption ? selectedOption.consumptionWKg : 0;
  const consumptionFL = selectedOption ? selectedOption.consumptionFL : 0;
  const consumptionFKg = selectedOption ? selectedOption.consumptionFKg : 0;

  const calculateKilogrammat = () => {
    const floorsLitres = parseFloat(floorlitre);
    const wallsLitres = parseFloat(wallLitre);
    const floorsTimes = parseInt(floorTimes);
    const wallsTimes = parseInt(wallTimes);

    const floorKg = isNaN(floorsLitres) ? 0 : floorsLitres * consumptionFKg * floorsTimes;
    const wallKg = isNaN(wallsLitres) ? 0 : wallsLitres * consumptionWKg * wallsTimes;
    const floorL = isNaN(floorsLitres) ? 0 : floorsLitres * consumptionFL * floorsTimes;
    const wallL = isNaN(wallsLitres) ? 0 : wallsLitres * consumptionWL * wallsTimes;
    const totalLQty = floorL + wallL;

    setFloorKilos(floorKg.toFixed(2));
    setWallKilos(wallKg.toFixed(2));
    setFloorLitres(floorL.toFixed(2));
    setWallLitres(wallL.toFixed(2));
    setFloorTimes(isNaN(floorsTimes) ? '' : floorsTimes.toFixed(0));
    setWallTimes(isNaN(wallsTimes) ? '' : wallsTimes.toFixed(0));
    setQty(totalLQty.toFixed(2));
  };

  const addButtonPressed = () => {
    const message = `${brand} ${qty} l lisätty listalle`;
    Alert.alert(message);
  };

  return (
    <Center w="100%" flex={1} px="3" background="#D9D9D9">
    <Box safeArea p="2" py="8" w="90%" maxW="290" h="80%">
    <Select bg="white" selectedValue={brand} minWidth="200" accessibilityLabel="Valikoi tuote" placeholder="Valikoi tuote" _selectedItem={{
        bg: "orange.500",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setBrand(itemValue)}>
      {waterproofOptions.map((option) => (
          <Select.Item 
            key={option.value}
            label={option.label}
            value={option.value}
           />
        ))}
        </Select>
      <Text mt="2" mb="2" color='#fafafa'>Syötä pinta-alat m²</Text>
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setFloorlitre(text)}
        value={floorlitre}
        keyboardType="numeric"
        placeholder="Anna lattioiden pinta-ala m²"
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setWallLitre(text)}
        value={wallLitre}
        keyboardType="numeric"
        placeholder="Anna seinien pinta-ala m²"
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setFloorTimes(text)}
        value={floorTimes}
        keyboardType="numeric"
        placeholder="Anna lattioiden levityskerrat"
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setWallTimes(text)}
        value={wallTimes}
        keyboardType="numeric"
        placeholder="Anna seinien levityskerrat"
      />
      <Button
        colorScheme="orange"
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
        onPress={calculateKilogrammat}
      >Laske</Button>
      {floorTimes !== '' && (
        <Text mt="2" color='#fafafa'>
          Lattioiden levityskerrat: {floorTimes}
        </Text>
      )}
      {wallTimes !== '' && (
        <Text color='#fafafa'>Seinien levityskerrat: {wallTimes}</Text>
      )}
      {floorKilos !== 0 && (
        <Text mt="2" color='#fafafa'>
          Lattiat menekki {floorKilos}kg / {floorLitres}l
        </Text>
      )}
      {wallKilos !== 0 && (
        <Text color='#fafafa'>
          Seinät menekki {wallKilos}kg / {wallLitres}l
        </Text>
      )}
      <Text mt="2" color='#fafafa'>Huomioi materiaalihukka! Laskelma on vain arvio menekistä eikä siinä huomioida olosuhteita tai ainehukkaa.</Text>
      <Button
        colorScheme="orange"
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
        onPress={addButtonPressed}
      >Lisää listaan</Button>
    </Box>
    <Box w="100%" position='absolute' height='85%' bottom='0' background='#242424' opacity='100' roundedTopLeft='20' zIndex='-10'></Box>
    </Center>
  );
};

export default WaterProof;