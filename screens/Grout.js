import React, { useState } from 'react';
import { Alert } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { groutOptions } from '../src/data/groutData';
import styles from '../src/styles/style'


const Grout = () => {
  const [brand, setBrand] = useState(groutOptions[0].value);
  const [groutResult, setGroutResult] = useState('');
  const [totalResult, setTotalResult] = useState('');
  const [A, setA] = useState(''); // tile height mm
  const [B, setB] = useState(''); // tile width mm
  const [C, setC] = useState(''); // tile thickness mm
  const [D, setD] = useState(''); // grout width mm
  const [E, setE] = useState(''); // area m²

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

  const addButtonPressed = () => {
    const message = `${brand} ${totalResult}kg lisätty listalle`;
    Alert.alert(message);
  };

  return (
    <Center w="100%" flex={1} px="3" background='#000'>
    <Box safeArea p="2" py="8" w="90%" maxW="290">
      <Select bg="white" selectedValue={brand} minWidth="200" accessibilityLabel="Valikoi tuote" placeholder="Valikoi tuote" _selectedItem={{
        bg: "orange.500",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setBrand(itemValue)}>
      {groutOptions.map((option) => (
          <Select.Item 
            key={option.value}
            label={option.label}
            value={option.value}
           />
        ))}
        </Select>
      <Text mt="2" mb="2" color='#fafafa'>Syötä laatan mitat (mm) ja sauman leveys (mm)</Text>
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
      <Button onPress={calculateConsumption}         colorScheme="orange"
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2" >Laske</Button>
      {groutResult !== '' && (
        <Text mt="2" color='#fafafa' fontSize="lg">Menekki: {groutResult} kg/m²</Text>
      )}
      {groutResult !== '' && (
        <Text color='#fafafa' fontSize="lg">Menekki: {totalResult} kg/{E}m²</Text>
      )}
      <Text mt="2" color='#fafafa'>Huomioi materiaalihukka! Laskelma on vain arvio menekistä eikä siinä huomioida olosuhteita tai ainehukkaa.</Text>
      <Button
        onPress={addButtonPressed}
        colorScheme="orange"
        _text={{fontSize: "xl", fontWeight: 'bold'}}
        mt="2"
      >Lisää listaan</Button>
    </Box>
    </Center>
  );
};

export default Grout;
