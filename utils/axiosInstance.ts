import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.SERVER_BASE_URL, // Main Backend API
  headers: {
    'Content-Type': 'application/json',
  },
});
