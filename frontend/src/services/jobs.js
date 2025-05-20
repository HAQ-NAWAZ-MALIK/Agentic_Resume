import api from './api';

/**
 * Get all job applications for the current user
 * @param {Object} filters - Optional filters (status, company, sort_by, sort_dir)
 * @returns {Promise} - API response
 */
export const getJobs = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get(`/jobs${queryString}`);
  return response.data;
};

/**
 * Get a specific job application by ID
 * @param {number} id - Job application ID
 * @returns {Promise} - API response
 */
export const getJob = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

/**
 * Create a new job application
 * @param {Object} jobData - Job application data
 * @returns {Promise} - API response
 */
export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

/**
 * Update an existing job application
 * @param {number} id - Job application ID
 * @param {Object} jobData - Job application data to update
 * @returns {Promise} - API response
 */
export const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

/**
 * Delete a job application
 * @param {number} id - Job application ID
 * @returns {Promise} - API response
 */
export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

/**
 * Tailor a resume for a job application
 * @param {number} jobId - Job application ID
 * @param {Object} tailorData - Tailoring parameters
 * @returns {Promise} - API response
 */
export const tailorResume = async (jobId, tailorData) => {
  const response = await api.post(`/jobs/${jobId}/tailor`, tailorData);
  return response.data;
};

/**
 * Get the tailored resume for a job application
 * @param {number} jobId - Job application ID
 * @returns {Promise} - API response
 */
export const getTailoredResume = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}/tailored`);
  return response.data;
};

/**
 * Get job application statistics
 * @returns {Promise} - API response
 */
export const getJobStats = async () => {
  const response = await api.get('/jobs/stats');
  return response.data;
};