import apiService from './api.service';
import config from '../config/api.config';

/**
 * Business service
 * Handles all business-related API calls
 */
const businessService = {
  /**
   * Get all businesses
   * @returns {Promise} Array of businesses
   */
  async getAll() {
    return apiService.get(config.endpoints.businesses);
  },

  /**
   * Get business by ID
   * @param {string} id - Business ID
   * @returns {Promise} Business data
   */
  async getById(id) {
    return apiService.get(`${config.endpoints.businesses}/${id}`);
  },

  /**
   * Search businesses
   * @param {object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {string} params.category - Category filter
   * @param {string} params.location - Location filter
   * @returns {Promise} Array of businesses
   */
  async search({ q, category, location }) {
    const queryParams = new URLSearchParams();
    if (q) queryParams.append('q', q);
    if (category) queryParams.append('category', category);
    if (location) queryParams.append('location', location);
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${config.endpoints.businessSearch}?${queryString}`
      : config.endpoints.businesses;
    
    return apiService.get(endpoint);
  },

  /**
   * Create new business
   * @param {FormData} formData - Business data with photos
   * @returns {Promise} Created business
   */
  async create(formData) {
    return apiService.postFormData(config.endpoints.businesses, formData, true);
  },

  /**
   * Update business
   * @param {string} id - Business ID
   * @param {object} data - Updated business data
   * @returns {Promise} Updated business
   */
  async update(id, data) {
    return apiService.put(`${config.endpoints.businesses}/${id}`, data, true);
  },

  /**
   * Delete business
   * @param {string} id - Business ID
   * @returns {Promise} Deletion confirmation
   */
  async delete(id) {
    return apiService.delete(`${config.endpoints.businesses}/${id}`, true);
  }
};

export default businessService;

