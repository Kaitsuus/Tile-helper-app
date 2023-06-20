import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const signupUser = async (email, password) => {
  try {
    const response = await axios.post(baseUrl + '/users', { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      // Throw a custom error with the error message from the server
      throw new Error(error.response.data.error);
    } else {
      // Throw the original error if there's no custom error message from the server
      throw error;
    }
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      api.login,
      {
        email: email,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    await AsyncStorage.setItem('token', response.data.token); // Store the token in local storage
    if (response.data.id) {
      await AsyncStorage.setItem('userId', response.data.id); // Store the user ID in local storage
    }
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    if (error.response && error.response.data && error.response.data.error) {
      // Throw a custom error with the error message from the server
      throw new Error(error.response.data.error);
    } else {
      // Throw the original error if there's no custom error message from the server
      throw error;
    }
  }
};

export const makeAuthenticatedRequest = async (url, method, data = null) => {
  try {
    const token = await AsyncStorage.getItem('token'); // Retrieve the token from local storage

    // Check if the token is available
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }

    const response = await axios({
      method: method,
      url: url,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error during authenticated request:', error);

    if (error.response) {
      console.error(
        'Server responded with status code:',
        error.response.status
      );
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error(
        'Request was made but no response was received:',
        error.request
      );
    } else {
      console.error('Error while setting up the request:', error.message);
    }

    throw error;
  }
};

export const getLoggedInUserId = async () => {
  const userId = await AsyncStorage.getItem('userId');
  return userId;
};

export const fetchSomeData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }
    const response = await makeAuthenticatedRequest(api.someEndpoint, 'GET');
    return response;
  } catch (error) {
    console.error('Error during fetch some data:', error);
    throw error;
  }
};

export const fetchUserDataById = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }
    const response = await makeAuthenticatedRequest(
      `${api.users}/${userId}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error(`Error during fetch user data (ID: ${userId}):`, error);
    throw error;
  }
};

export const deleteItemFromDB = async (listId, itemId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }

    // Replace this URL with the appropriate URL for your backend server
    const url = `${api.lists}/${listId}/items/${itemId}`;

    console.log('Deleting item with URL:', url); // Add this line to log the URL

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    await axios.delete(url, { headers: headers });
  } catch (error) {
    console.error('Error during delete item from DB:', error);
    throw error;
  }
};
