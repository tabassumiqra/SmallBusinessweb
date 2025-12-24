import apiService from './api.service';
import config from '../config/api.config';

/**
 * Authentication service
 * Handles all auth-related API calls
 */
const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Auth response with token and user
   */
  async login(email, password) {
    return apiService.post(config.endpoints.login, { email, password });
  },

  /**
   * Register new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Auth response with token and user
   */
  async signup(name, email, password) {
    return apiService.post(config.endpoints.signup, { name, email, password });
  },

  /**
   * Get current authenticated user
   * @returns {Promise} User data
   */
  async getMe() {
    return apiService.get(config.endpoints.me, true);
  },

  /**
   * Redirect to Google OAuth
   */
  loginWithGoogle() {
    window.location.href = `${config.apiUrl}${config.endpoints.googleAuth}`;
  },

  /**
   * Save token to localStorage
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('token', token);
  },

  /**
   * Get token from localStorage
   * @returns {string|null} JWT token
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Remove token from localStorage
   */
  removeToken() {
    localStorage.removeItem('token');
  }
};

export default authService;

