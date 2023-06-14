import axios from 'axios';
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(api.login, {
      email: email,
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};