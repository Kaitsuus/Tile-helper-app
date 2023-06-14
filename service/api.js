import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL

export default {
  login: `${baseUrl}/login`,
  // Add other API endpoints as needed
};