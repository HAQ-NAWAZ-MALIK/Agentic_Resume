import api from './api';

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - API response
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Get the current user's profile
 * @returns {Promise} - API response
 */
export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Update the current user's profile
 * @param {Object} userData - User data to update
 * @returns {Promise} - API response
 */
export const updateProfile = async (userData) => {
  const response = await api.put('/auth/me', userData);
  return response.data;
};

/**
 * Change the user's password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword
  });
  return response.data;
};

/**
 * Refresh the access token using the refresh token
 * @returns {Promise} - API response
 */
export const refreshToken = async () => {
  const refreshTokenStr = localStorage.getItem('refreshToken');
  
  const response = await api.post('/auth/refresh', {}, {
    headers: {
      'Authorization': `Bearer ${refreshTokenStr}`
    }
  });
  
  return response.data;
};

/**
 * Request a password reset
 * @param {string} email - User's email
 * @returns {Promise} - API response
 */
export const resetPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};