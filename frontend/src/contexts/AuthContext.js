import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setCurrentUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setCurrentUser(response.data);
      localStorage.setItem('token', response.data.token || 'dummy-token');
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка входа. Проверьте учетные данные.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка регистрации. Попробуйте другие данные.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(profileData);
      setCurrentUser({ ...currentUser, profile: response.data });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка обновления профиля.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 