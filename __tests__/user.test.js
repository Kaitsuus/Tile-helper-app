

// Import dependencies
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupUser } from '../service/auth';
import { login } from '../service/auth';
import { BASE_URL } from '@env'; // Import the base URL

jest.mock('axios'); // Mocking Axios
jest.mock('@react-native-async-storage/async-storage');

describe('signupUser', () => {
  beforeEach(() => {
    axios.post.mockClear(); // Clear the mock before each test
  });

  it('signs up the user and returns the user object', async () => {
    // Define the user object
    const user = {
      "avatar": "J",
      "email": "jesti@testit.fi",
      "id": "64a7ea290a2c9c029954649e",
      "languagePreference": "fi",
      "lists": []
    };

    // Mock the post request
    axios.post.mockResolvedValue({ data: user });

    // Call the function
    const result = await signupUser('test@example.com', 'password');

    // Check the number of times the Axios post function was called 
    expect(axios.post).toHaveBeenCalledTimes(1);

    // Check if the function was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/users`, { 'email': 'test@example.com', 'password': 'password' });

    // Check if the function returns the correct user object
    expect(result).toEqual(user);
  });

  it('throws an error when the signup fails', async () => {
    const error = new Error('Test error');
    // Mock the post request with an error
    axios.post.mockRejectedValue(error);
    // Call the function and check if it throws the correct error
    await expect(signupUser('test@example.com', 'password')).rejects.toThrow('Test error');
  });
});

describe('login', () => {
  beforeEach(() => {
    axios.post.mockClear(); // Clear the mock before each test
  });

  it('logs in the user, stores token and user id, and returns the response', async () => {
    // Define the user object and token
    const user = {
      "id": "user1",
      "token": "abc123"
    };

    // Mock the post request
    axios.post.mockResolvedValue({ data: user });

    // Mock the AsyncStorage setItem method
    AsyncStorage.setItem = jest.fn(() => true);

    // Call the function
    const result = await login('test@example.com', 'password');

    // Check the number of times the Axios post function was called 
    expect(axios.post).toHaveBeenCalledTimes(1);

    // Check if the function was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/login`, { 'email': 'test@example.com', 'password': 'password' }, {"headers": {"Content-Type": "application/json"}});

    // Check if token and user id were stored
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2); 
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(1, 'token', 'abc123');
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(2, 'userId', 'user1');

    // Check if the function returns the correct user object
    expect(result).toEqual({ data: user });
  });

  it('throws an error when the login fails', async () => {
    const error = new Error('Test error');
    // Mock the post request with an error
    axios.post.mockRejectedValue(error);
    // Call the function and check if it throws the correct error
    await expect(login('test@example.com', 'password')).rejects.toThrow('Test error');
  });
});
