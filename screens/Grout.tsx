import React, { useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Button, Box, Text, Center, Select, CheckIcon } from 'native-base';
import { groutOptions } from '../src/data/groutMockData';
import styles from '../src/styles/style';
import mockData from '../src/data/mockData.json';

const Grout: React.FC = () => {
  const [brand, setBrand] = useState<string>(groutOptions[0].value);
  const [groutResult, setGroutResult] = useState<string>('');
  const [totalResult, setTotalResult] = useState<string>('');
  const [A, setA] = useState<string>(''); // tile height mm
  const [B, setB] = useState<string>(''); // tile width mm
  const [C, setC] = useState<string>(''); // tile thickness mm
  const [D, setD] = useState<string>(''); // grout width mm
  const [E, setE] = useState<string>(''); // area m²

  const currentUserIndex = 0; // Index of the current user (hardcoded for now)

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
    const user = mockData.users[currentUserIndex];
    const newItem = {
      name: `${brand} ${totalResult}`,
      amount: parseFloat(totalResult),
      unit: 'kg'
    };
    user.shoppingList.push(newItem);
    Alert.alert(`${newItem.name} lisätty listalle`);
    console.log(user);
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
    </Center>
  );
};

export default Grout;
