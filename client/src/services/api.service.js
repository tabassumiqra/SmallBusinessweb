import config from '../config/api.config';

/**
 * Base API service with common HTTP methods
 */
class ApiService {
  constructor() {
    this.baseUrl = config.apiUrl;
  }

  /**
   * Get authorization headers
   * @returns {object} Headers with Authorization token
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Make GET request
   * @param {string} endpoint - API endpoint
   * @param {boolean} auth - Include auth headers
   * @returns {Promise} Response data
   */
  async get(endpoint, auth = false) {
    const headers = auth ? this.getAuthHeaders() : {};
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  }

  /**
   * Make POST request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {boolean} auth - Include auth headers
   * @returns {Promise} Response data
   */
  async post(endpoint, body, auth = false) {
    const headers = auth ? this.getAuthHeaders() : {};
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  }

  /**
   * Make POST request with FormData (for file uploads)
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with files
   * @param {boolean} auth - Include auth headers
   * @returns {Promise} Response data
   */
  async postFormData(endpoint, formData, auth = false) {
    const headers = auth ? this.getAuthHeaders() : {};
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  }

  /**
   * Make PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {boolean} auth - Include auth headers
   * @returns {Promise} Response data
   */
  async put(endpoint, body, auth = false) {
    const headers = auth ? this.getAuthHeaders() : {};
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  }

  /**
   * Make DELETE request
   * @param {string} endpoint - API endpoint
   * @param {boolean} auth - Include auth headers
   * @returns {Promise} Response data
   */
  async delete(endpoint, auth = false) {
    const headers = auth ? this.getAuthHeaders() : {};
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  }
}

export default new ApiService();

