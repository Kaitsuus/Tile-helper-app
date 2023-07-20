import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

/**
 * Sign up a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the response data.
 * @throws {Error} If there is an error during the signup process.
 */
export const signupUser = async (email, password) => {
  try {
    const response = await axios.post(api.users, { email, password });
    console.log(response.data);
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

/**
 * Log in a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the response data.
 * @throws {Error} If there is an error during the login process.
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(
      api.login,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
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

/**
 * Make an authenticated request with the provided URL, method, and data.
 * @param {string} url - The URL for the request.
 * @param {string} method - The HTTP method for the request.
 * @param {Object|null} data - The request data (optional).
 * @returns {Promise<Object>} A promise that resolves to the response data.
 * @throws {Error} If there is an error during the authenticated request.
 */
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
        Authorization: `Bearer ${token}`,
      },
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

/**
 * Get the logged-in user's ID.
 * @returns {Promise<string|null>} A promise that resolves to the logged-in user's ID, or null if not logged in.
 */
export const getLoggedInUserId = async () => {
  const userId = await AsyncStorage.getItem('userId');
  return userId;
};

/**
 * Fetch user data by ID.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object>} A promise that resolves to the response data.
 * @throws {Error} If there is an error during the fetch user data process.
 */
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

/**
 * Delete an item from the database.
 * @param {string} listId - The list ID.
 * @param {string} itemId - The item ID.
 * @throws {Error} If there is an error during the delete item process.
 */
export const deleteItemFromDB = async (listId, itemId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }
    const url = `${api.lists}/${listId}/items/${itemId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios.delete(url, { headers: headers });
  } catch (error) {
    console.error('Error during delete item from DB:', error);
    throw error;
  }
};

/**
 * Delete a list from the database.
 * @param {string} listId - The list ID.
 * @throws {Error} If there is an error during the delete list process.
 */
export const deleteListFromDB = async (listId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }
    const url = `${api.lists}/${listId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios.delete(url, { headers: headers });
  } catch (error) {
    console.error('Error during delete list from DB:', error);
    throw error;
  }
};

/**
 * Delete a user and associated lists from the database.
 * @param {string} userId - The user ID.
 * @throws {Error} If there is an error during the delete user process.
 */
export const deleteUserFromDB = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token available. User is not logged in.');
    }

    // Fetch all lists associated with the user
    const lists = await fetchAndTransformLists();

    // Delete each list
    for (const list of lists) {
      await deleteListFromDB(list._id);
    }

    const url = `${api.users}/${userId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Delete the user
    const response = await axios.delete(url, { headers: headers });
    if (response.status === 200) {
      console.log('User and all associated lists deleted successfully');
    } else {
      console.error('Error deleting user:', response);
    }
  } catch (error) {
    console.error('Error during delete User from DB:', error);
    throw error;
  }
};

/**
 * Fetch and transform lists associated with the logged-in user.
 * @returns {Promise<Array>} A promise that resolves to the transformed lists.
 * @throws {Error} If there is an error during the fetch and transform lists process.
 */
export const fetchAndTransformLists = async () => {
  const userId = await getLoggedInUserId();
  try {
    const response = await makeAuthenticatedRequest(
      `${api.lists}/user/${userId}/lists`,
      'GET'
    );
    const transformedLists = response.data.map((list) => {
      const transformedItems = list.items.map((item) => {
        return {
          ...item,
          _id: item._id,
          amount: item.amount || 0,
        };
      });

      return {
        ...list,
        _id: list.id,
        items: transformedItems,
      };
    });
    return transformedLists;
  } catch (error) {
    console.error('Error while fetching lists:', error);
    throw error;
  }
};
