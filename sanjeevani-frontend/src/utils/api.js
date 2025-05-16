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

// Appointments API
export const appointmentsApi = {
  // Get all appointments
  getAppointments: async (filters = {}) => {
    try {
      if (DEMO_MODE) {
        return await mockApi.getAppointments();
      }

      const response = await authAxios.get('/api/appointments', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get appointments' };
    }
  },

  // Get appointment by ID
  getAppointment: async (id) => {
    try {
      const response = await authAxios.get(`/api/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get appointment' };
    }
  },

  // Create appointment
  createAppointment: async (appointmentData) => {
    try {
      if (DEMO_MODE) {
        return await mockApi.bookAppointment(appointmentData);
      }

      const response = await authAxios.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to create appointment' };
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await authAxios.put(`/api/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update appointment' };
    }
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    try {
      const response = await authAxios.delete(`/api/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to cancel appointment' };
    }
  },

  // Send appointment reminder
  sendReminder: async (id) => {
    try {
      const response = await authAxios.post(`/api/appointments/reminder/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to send reminder' };
    }
  },
};

// Emergency API
export const emergencyApi = {
  // Create emergency request
  createEmergencyRequest: async (emergencyData) => {
    try {
      const response = await authAxios.post('/api/appointments/emergency', emergencyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to create emergency request' };
    }
  },

  // Get emergency request by ID
  getEmergencyRequest: async (id) => {
    try {
      const response = await authAxios.get(`/api/appointments/emergency/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get emergency request' };
    }
  },

  // Find nearby hospitals
  findNearbyHospitals: async (address, radius = 5000) => {
    try {
      const response = await authAxios.post('/api/appointments/emergency/nearby-hospitals', {
        address,
        radius,
      });
      return response.data.hospitals;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to find nearby hospitals' };
    }
  },
};

// Doctors API
export const doctorsApi = {
  // Get all doctors
  getDoctors: async (filters = {}) => {
    try {
      const response = await authAxios.get('/api/doctors', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get doctors' };
    }
  },

  // Get doctor by ID
  getDoctor: async (id) => {
    try {
      const response = await authAxios.get(`/api/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get doctor' };
    }
  },
};

// Hospitals API
export const hospitalsApi = {
  // Get all hospitals
  getHospitals: async (filters = {}) => {
    try {
      const response = await authAxios.get('/api/hospitals', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get hospitals' };
    }
  },

  // Get hospital by ID
  getHospital: async (id) => {
    try {
      const response = await authAxios.get(`/api/hospitals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get hospital' };
    }
  },
};

export default {
  appointmentsApi,
  emergencyApi,
  doctorsApi,
  hospitalsApi,
};