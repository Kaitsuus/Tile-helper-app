import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fafafa',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
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
    backgroundColor: '#fafafa',
  },
});

export default styles;
