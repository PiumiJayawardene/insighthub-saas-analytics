/**
 * Auth Context
 * Manages authentication state across the app.
 * Persists JWT token in localStorage.
 * Attaches token to all API requests via axios interceptor.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'insighthub_token';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem(TOKEN_KEY, res.data.token);
      setUser(res.data.user);

      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem(TOKEN_KEY, res.data.token);
      setUser(res.data.user);

      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updatePreferences = useCallback(async (prefs) => {
    const res = await api.put('/auth/preferences', prefs);
    setUser(res.data.user);

    return res.data.user;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updatePreferences,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};