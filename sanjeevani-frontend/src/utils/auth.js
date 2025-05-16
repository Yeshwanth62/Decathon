import axios from 'axios';
import mockApi from './mockApi';

// Demo mode flag - set to false to use real API
const DEMO_MODE = process.env.NODE_ENV === 'production' ? false : true;

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Axios instance with auth header
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Login user
export const login = async (email, password) => {
  try {
    if (DEMO_MODE) {
      // Use mock API in demo mode
      const user = await mockApi.login(email, password);
      return user;
    }

    // Real API call
    const response = await axios.post(`${API_URL}/api/users/login`, {
      username: email,
      password,
    });

    const { access_token, user } = response.data;

    // Store token in localStorage
    localStorage.setItem('token', access_token);

    return user;
  } catch (error) {
    throw error.response?.data || { detail: 'Login failed' };
  }
};

// Register user
export const register = async (userData) => {
  try {
    if (DEMO_MODE) {
      // Use mock API in demo mode
      return await mockApi.register(userData);
    }

    // Real API call
    const response = await axios.post(`${API_URL}/api/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Registration failed' };
  }
};

// Firebase login
export const firebaseLogin = async (idToken) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/firebase-login`, {
      id_token: idToken,
    });

    const { access_token, user } = response.data;

    // Store token in localStorage
    localStorage.setItem('token', access_token);

    return user;
  } catch (error) {
    throw error.response?.data || { detail: 'Firebase login failed' };
  }
};

// Get current user
export const getUser = async () => {
  try {
    if (DEMO_MODE) {
      // Use mock API in demo mode
      return await mockApi.getUser();
    }

    // Real API call
    const response = await authAxios.get('/api/users/me');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('token');
    }
    throw error.response?.data || { detail: 'Failed to get user data' };
  }
};

// Update user profile
export const updateProfile = async (profileData, role) => {
  try {
    const response = await authAxios.put(`/api/users/profile/${role}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to update profile' };
  }
};

// Send OTP
export const sendOTP = async (phone) => {
  try {
    if (DEMO_MODE) {
      // Use mock API in demo mode
      return await mockApi.sendOTP(phone);
    }

    // Real API call
    const response = await axios.post(`${API_URL}/api/users/send-otp`, { phone });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to send OTP' };
  }
};

// Verify OTP
export const verifyOTP = async (phone, otp) => {
  try {
    if (DEMO_MODE) {
      // Use mock API in demo mode
      return await mockApi.verifyOTP(phone, otp);
    }

    // Real API call
    const response = await axios.post(`${API_URL}/api/users/verify-otp`, { phone, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to verify OTP' };
  }
};

// Update language preference
export const updateLanguage = async (language) => {
  try {
    if (DEMO_MODE) {
      // Use mock API in demo mode
      return await mockApi.updateLanguage(language);
    }

    // Real API call
    const response = await authAxios.put('/api/users/language', { language });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to update language preference' };
  }
};

export default {
  isAuthenticated,
  login,
  register,
  firebaseLogin,
  getUser,
  updateProfile,
  sendOTP,
  verifyOTP,
  updateLanguage,
};
