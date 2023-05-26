import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

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
    <View style={styles.container}>
      <Picker
        selectedValue={brand}
        style={styles.picker}
        onValueChange={(itemValue) => setBrand(itemValue)}
      >
        {groutOptions.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            color={brand === option.value ? '#ED7931' : 'black'}
          />
        ))}
      </Picker>
      <Text style={styles.label}>Syötä laatan mitat (mm) ja sauman leveys (mm)</Text>
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
      <Button title="Laske" onPress={calculateConsumption} buttonStyle={styles.button} />
      {groutResult !== '' && (
        <Text style={styles.result}>Menekki: {groutResult} kg/m²</Text>
      )}
      {groutResult !== '' && (
        <Text style={styles.result}>Menekki: {totalResult} kg/{E}m²</Text>
      )}
      <Button
        title="Lisää listaan"
        buttonStyle={styles.button}
        onPress={addButtonPressed}
      />
    </View>
  );
};

export default Grout;
