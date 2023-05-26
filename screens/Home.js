import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';


const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Saumaus"
        onPress={() => navigation.navigate('Grout')}
        buttonStyle={styles.button}
      />
      <Button
        title="Vedeneristys"
        onPress={() => navigation.navigate('WaterProof')}
        buttonStyle={styles.button}
      />
      <Button
        title="Kiinnitys"
        onPress={() => navigation.navigate('Adhesive')}
        buttonStyle={styles.button}
      />
      <Button
        title="Tasoitus"
        onPress={() => navigation.navigate('Plaster')}
        buttonStyle={styles.button}
      />
      <Button
        title="Tasausjärjestelmät"
        onPress={() => navigation.navigate('Test')}
        buttonStyle={styles.button}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fafafa'
  },
  button: {
    backgroundColor: '#ED7931',
    width: '60%',
    marginBottom: 8,
    borderRadius: 8,
    textAlign: 'center', // center the text
    width: 250, // set a fixed width
    height: 50
  },
  result: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center'
  },
  picker: {
    width: 200,
    height: 50,
    marginBottom: 20
  }
});
