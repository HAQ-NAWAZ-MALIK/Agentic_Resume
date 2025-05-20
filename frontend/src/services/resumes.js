import api from './api';

/**
 * Get all resumes for the current user
 * @returns {Promise} - API response
 */
export const getResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

/**
 * Get a specific resume by ID
 * @param {number} id - Resume ID
 * @returns {Promise} - API response
 */
export const getResume = async (id) => {
  const response = await api.get(`/resumes/${id}`);
  return response.data;
};

/**
 * Get the HTML representation of a resume
 * @param {number} id - Resume ID
 * @returns {Promise} - API response
 */
export const getResumeHtml = async (id) => {
  const response = await api.get(`/resumes/${id}/html`);
  return response.data;
};

/**
 * Get the default resume for the current user
 * @returns {Promise} - API response
 */
export const getDefaultResume = async () => {
  const response = await api.get('/resumes/default');
  return response.data;
};

/**
 * Create a new resume
 * @param {Object} resumeData - Resume data
 * @returns {Promise} - API response
 */
export const createResume = async (resumeData) => {
  const response = await api.post('/resumes', resumeData);
  return response.data;
};

/**
 * Update an existing resume
 * @param {number} id - Resume ID
 * @param {Object} resumeData - Resume data to update
 * @returns {Promise} - API response
 */
export const updateResume = async (id, resumeData) => {
  const response = await api.put(`/resumes/${id}`, resumeData);
  return response.data;
};

/**
 * Delete a resume
 * @param {number} id - Resume ID
 * @returns {Promise} - API response
 */
export const deleteResume = async (id) => {
  const response = await api.delete(`/resumes/${id}`);
  return response.data;
};