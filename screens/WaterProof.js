import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import styles from '../src/styles/style'

const WaterProof = () => {
  const [floorlitre, setFloorlitre] = useState('');
  const [wallLitre, setWallLitre] = useState('');
  const [floorTimes, setFloorTimes] = useState('');
  const [wallTimes, setWallTimes] = useState('');
  const [floorKilos, setFloorKilos] = useState(0);
  const [wallKilos, setWallKilos] = useState(0);
  const [floorLitres, setFloorLitres] = useState(0);
  const [wallLitres, setWallLitres] = useState(0);
  const [qty, setQty] = useState(0);

  const calculateKilogrammat = () => {
    const floorsLitres = parseFloat(floorlitre);
    const wallsLitres = parseFloat(wallLitre);
    const floorsTimes = parseInt(floorTimes);
    const wallsTimes = parseInt(wallTimes);

    const floorKg = isNaN(floorsLitres) ? 0 : floorsLitres * 1 * floorsTimes; // 1 kg/m²
    const wallKg = isNaN(wallsLitres) ? 0 : wallsLitres * 0.8 * wallsTimes; // 0.8 kg/m²
    const floorL = isNaN(floorsLitres) ? 0 : floorsLitres * 0.8 * floorsTimes; // 0.8 kg/m²
    const wallL = isNaN(wallsLitres) ? 0 : wallsLitres * 0.6 * wallsTimes; // 0.8 kg/m²
    const totalKgQty = floorKg + wallKg;

    setFloorKilos(floorKg.toFixed(2));
    setWallKilos(wallKg.toFixed(2));
    setFloorLitres(floorL.toFixed(2));
    setWallLitres(wallL.toFixed(2));
    setFloorTimes(isNaN(floorsTimes) ? '' : floorsTimes.toFixed(0));
    setWallTimes(isNaN(wallsTimes) ? '' : wallsTimes.toFixed(0));
    setQty(totalKgQty.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Syötä pinta-alat m²</Text>
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setFloorlitre(text)}
        value={floorlitre}
        keyboardType="numeric"
        placeholder="Anna lattioiden pinta-ala m²  (väh. 0,8 l/m² = 1 kg/m²)"
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setWallLitre(text)}
        value={wallLitre}
        keyboardType="numeric"
        placeholder="Anna seinien pinta-ala m² (väh. 0,6 l/m² = 0.8 kg/m²)"
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setFloorTimes(text)}
        value={floorTimes}
        keyboardType="numeric"
        placeholder="Anna lattioiden levityskerrat (väh. 2)"
      />
      <MaskedTextInput
        style={styles.input}
        mask="9999"
        onChangeText={(text) => setWallTimes(text)}
        value={wallTimes}
        keyboardType="numeric"
        placeholder="Anna seinien levityskerrat (väh. 2)"
      />
      <Button
        title="Laske"
        onPress={calculateKilogrammat}
        buttonStyle={styles.button}
      />
      {floorTimes !== '' && (
        <Text style={styles.result}>
          Lattioiden levityskerrat: {floorTimes}
        </Text>
      )}
      {wallTimes !== '' && (
        <Text style={styles.result}>Seinien levityskerrat: {wallTimes}</Text>
      )}
      {floorKilos !== 0 && (
        <Text style={styles.result}>
          Lattiat menekki {floorKilos}kg / {floorLitres}l
        </Text>
      )}
      {wallKilos !== 0 && (
        <Text style={styles.result}>
          Seinät menekki {wallKilos}kg / {wallLitres}l
        </Text>
      )}
      <Button
        title="Lisää listaan"
        buttonStyle={styles.button}
        onPress={() => {
          const message = `vesieriste ${qty}kg lisätty listalle`;
          Alert.alert(message);
        }}
      />
    </View>
  );
};

export default WaterProof;