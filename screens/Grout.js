import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker'

const Grout = () => {
  const [brand, setBrand] = useState('Kiilto Pro Tilegrout');
  const [groutResult, setGroutResult] = useState('');
  const [totalResult, setTotalResult] = useState('');
  let consumption = 0;

  switch (brand) {
    case 'Kiilto Pro Tilegrout':
      consumption = 1.6;
      break;
    case 'LitokolStylegrout':
      consumption = 1.6;
      break;
    case 'Ardex G8S Flex':
      consumption = 1.6;
      break;
    default:
      consumption = 0;
  }

  const [A, setA] = useState('');
  const [B, setB] = useState('');
  const [C, setC] = useState('');
  const [D, setD] = useState('');
  const [E, setE] = useState('');

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


  return (
    <View style={styles.container}>
      <Picker
        selectedValue={brand}
        style={styles.picker}
        onValueChange={(itemValue) => setBrand(itemValue)}
      >
        <Picker.Item label="Kiilto Pro Tilegrout" value="KiiltoProTilegrout" color={brand === "KiiltoProTilegrout" ? "#ED7931" : "black"} />
        <Picker.Item label="Litokol Stylegrout" value="LitokolStylegrout" color={brand === "LitokolStylegrout" ? "#ED7931" : "black"} />
        <Picker.Item label="Ardex G8S Flex" value="yet a other brand" color={brand === "yet a other brand" ? "#ED7931" : "black"} />
      </Picker>
      <Text style={styles.label}>Syötä laatan mitat (mm) ja sauman leveys (mm)</Text>
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setA(text)}
        value={A}
        keyboardType="numeric"
        placeholder='Laatan pituus (mm)'
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setB(text)}
        value={B}
        keyboardType="numeric"
        placeholder='Laatan leveys (mm)'
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setC(text)}
        value={C}
        keyboardType="numeric"
        placeholder='Laatan paksuus (mm)'
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setD(text)}
        value={D}
        keyboardType="numeric"
        placeholder='Sauman leveys (mm)'
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setE(text)}
        value={E}
        keyboardType="numeric"
        placeholder='Saumattava alue (m²)'
      />
      <Button
        title="Laske"
        onPress={calculateConsumption}
        buttonStyle={styles.button}
      />
      {groutResult !== '' && (
        <Text style={styles.result}>Menekki: {groutResult} kg/m²</Text>
      )}
      {groutResult !== '' && (
        <Text style={styles.result}>Menekki: {totalResult} kg/{E}m²</Text>
      )}
      <Button
        title="Lisää listaan"
        buttonStyle={styles.button}
        onPress={() => {
            let quantity = 1;
        if (totalResult < 3) {
        quantity = 1;
        } else {
        quantity = Math.ceil(totalResult / 3);
        }
        const message = `${brand} 3kg ${quantity} kpl lisätty listalle`;
        Alert.alert(message);
      }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000'
  },
  label: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fafafa'
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa'
  },
  button: {
    backgroundColor: '#ED7931',
    width: 200,
    marginBottom: 10,
  },
  result: {
    color: '#fafafa',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    width: 250,
    borderWidth: 1,
    borderColor: '#ED7931',
    height: 5,
    marginBottom: 10,
    backgroundColor: '#fafafa'
  },
});

export default Grout;
