import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm_token') || null);
  const [loading, setLoading] = useState(true);

  // Load existing session on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('crm_token');
      const savedUser = localStorage.getItem('crm_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Verify with backend
          const res = await API.get('/users/profile');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('crm_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session validation error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/users/login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('crm_token', receivedToken);
      localStorage.setItem('crm_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler
  const register = async (name, email, password, role) => {
    const res = await API.post('/users/register', { name, email, password, role });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('crm_token', receivedToken);
      localStorage.setItem('crm_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
