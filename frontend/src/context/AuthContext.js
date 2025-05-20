import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile, refreshToken, resetPassword as apiResetPassword } from '../services/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Get user profile
          const userData = await getProfile();
          setCurrentUser(userData.user);
          setIsAuthenticated(true);
        } catch (err) {
          // Token expired, try to refresh
          try {
            const refreshTokenStr = localStorage.getItem('refreshToken');
            if (refreshTokenStr) {
              const { access_token } = await refreshToken();
              localStorage.setItem('token', access_token);
              
              // Retry getting profile with new token
              const userData = await getProfile();
              setCurrentUser(userData.user);
              setIsAuthenticated(true);
            } else {
              // No refresh token available, logout
              logout();
            }
          } catch (refreshErr) {
            console.error('Failed to refresh token:', refreshErr);
            logout();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiLogin(email, password);
      
      // Store tokens in localStorage
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiRegister(userData);
      
      // Store tokens in localStorage
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Reset state
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await apiResetPassword(email);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}