import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';
import { MaskedTextInput } from 'react-native-mask-text';
import styles from '../src/styles/style'

const Adhesive = () => {
  const [thickness, setThickness] = useState('3.5');
  const [squareMeters, setSquareMeters] = useState('');
  const [adhesiveAmount, setAdhesiveAmount] = useState('');

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kiinnityslaasti Laskuri</Text>
      <Text style={styles.label}>Valikoi hammastus:</Text>
      <Picker
        selectedValue={thickness}
        style={styles.picker}
        onValueChange={(itemValue) => setThickness(itemValue)}
      >
        <Picker.Item
          label="3.5 mm"
          value="3.5"
          color={thickness === '3.5' ? '#ED7931' : 'black'}
        />
        <Picker.Item
          label="6 mm"
          value="6"
          color={thickness === '6' ? '#ED7931' : 'black'}
        />
        <Picker.Item
          label="10 mm"
          value="10"
          color={thickness === '10' ? '#ED7931' : 'black'}
        />
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
      {adhesiveAmount !== '' && (
        <Text style={styles.result}>Laasti määrä: {adhesiveAmount} kg</Text>
      )}
      <Button
        title="Lisää listaan"
        buttonStyle={styles.button}
        onPress={() => {
          const message = `Laasti ${adhesiveAmount} kg lisätty listalle`;
          Alert.alert(message);
        }}
      />
    </View>
  );
};

export default Adhesive;
