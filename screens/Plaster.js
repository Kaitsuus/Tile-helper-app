import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';
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
    <View style={styles.container}>
      <Text style={styles.title}>Tasoite laskuri</Text>
      <Picker
        selectedValue={brand}
        style={styles.picker}
        onValueChange={(itemValue) => setBrand(itemValue)}
      >
        {plasterOptions.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            color={brand === option.value ? '#ED7931' : 'black'}
          />
        ))}
      </Picker>
      <Text style={styles.label}>Syötä alue (m²):</Text>
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setSquareMeters(text)}
        value={squareMeters}
        keyboardType="numeric"
        placeholder="Syötä m²"
      />
      <Button
        buttonStyle={styles.button}
        title="Laske"
        onPress={calculateConsumption}
      />
      {plasterAmount !== '' && (
        <Text style={styles.result}>Tasoite määrä: {plasterAmount} kg</Text>
      )}
      <Button
        title="Lisää listaan"
        buttonStyle={styles.button}
        onPress={addButtonPressed}
      />
    </View>
  );
};

export default Plaster;
