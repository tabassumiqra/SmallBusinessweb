/**
 * API Configuration
 * Centralized configuration for API calls
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const config = {
  apiUrl: API_URL,
  endpoints: {
    // Auth
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    me: '/api/auth/me',
    googleAuth: '/api/auth/google',

    // Business
    businesses: '/api/businesses',
    businessSearch: '/api/businesses/search',

    // Upload
    upload: '/api/upload',
    uploadMultiple: '/api/upload/multiple',

    // Examples
    examples: '/api/examples'
  }
};

export default config;

