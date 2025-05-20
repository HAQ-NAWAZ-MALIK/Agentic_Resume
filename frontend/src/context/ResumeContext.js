import { createContext, useContext, useState, useEffect } from 'react';
import { getResumes, getResume, createResume, updateResume, deleteResume } from '../services/resumes';

const ResumeContext = createContext();

export function useResumes() {
  return useContext(ResumeContext);
}

export function ResumeProvider({ children }) {
  const [resumes, setResumes] = useState([]);
  const [defaultResume, setDefaultResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load resumes on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getResumes();
      setResumes(response.resumes);
      
      // Find default resume
      const defaultOne = response.resumes.find(resume => resume.is_default);
      setDefaultResume(defaultOne || (response.resumes.length > 0 ? response.resumes[0] : null));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resumes');
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getResumeById = async (id) => {
    try {
      setError(null);
      const response = await getResume(id);
      return response.resume;
    } catch (err) {
      setError(err.response?.data?.message || `Failed to load resume with ID ${id}`);
      throw err;
    }
  };

  const addResume = async (resumeData) => {
    try {
      setError(null);
      const response = await createResume(resumeData);
      
      // Update state
      setResumes(prevResumes => [...prevResumes, response.resume]);
      
      // If this is the first resume or set as default, update defaultResume
      if (response.resume.is_default || resumes.length === 0) {
        setDefaultResume(response.resume);
      }
      
      return response.resume;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create resume');
      throw err;
    }
  };

  const editResume = async (id, resumeData) => {
    try {
      setError(null);
      const response = await updateResume(id, resumeData);
      
      // Update state
      setResumes(prevResumes =>
        prevResumes.map(resume => 
          resume.id === id ? response.resume : 
          // If this resume is set as default, unset others
          resumeData.is_default ? { ...resume, is_default: false } : resume
        )
      );
      
      // If this resume is now the default, update defaultResume
      if (response.resume.is_default) {
        setDefaultResume(response.resume);
      }
      
      return response.resume;
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update resume with ID ${id}`);
      throw err;
    }
  };

  const removeResume = async (id) => {
    try {
      setError(null);
      await deleteResume(id);
      
      // Update state
      setResumes(prevResumes => prevResumes.filter(resume => resume.id !== id));
      
      // If we deleted the default resume, update defaultResume
      if (defaultResume && defaultResume.id === id) {
        const newDefault = resumes.find(resume => resume.id !== id);
        setDefaultResume(newDefault || null);
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || `Failed to delete resume with ID ${id}`);
      throw err;
    }
  };

  const value = {
    resumes,
    defaultResume,
    loading,
    error,
    fetchResumes,
    getResumeById,
    addResume,
    editResume,
    removeResume
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}