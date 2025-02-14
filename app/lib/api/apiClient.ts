import axios from "axios";
import { headers } from 'next/headers';

// Helper to check if we're on the server
const isServer = () => typeof window === 'undefined';

// Create base URL for server-side requests
const getBaseUrl = () => {
  try {
    // Only try to access headers on the server
    if (isServer()) {
      const headersList = headers();
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = headersList.get('host') || 'localhost:3000';
      return `${protocol}://${host}`;
    }
    // Client-side: use relative paths
    return '';
  } catch (e) {
    // Fallback for client components
    return '';
  }
};

// Separate client for server-side and client-side
export const createApiClient = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
  });
};