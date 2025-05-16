// Mock API service for demo mode
import { getRandomInt } from './helper';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1234567890',
    role: 'patient',
    preferred_language: 'en',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Dr. Smith',
    email: 'drsmith@example.com',
    phone: '+1987654321',
    role: 'doctor',
    preferred_language: 'en',
    specialty: 'Cardiologist',
    hospital: 'City Hospital',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
];

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 2,
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    status: 'confirmed',
    type: 'in_person',
    reason: 'Regular checkup',
    symptoms: 'None',
    notes: '',
    doctorName: 'Dr. Smith',
    hospitalName: 'City Hospital',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    patient_id: 1,
    doctor_id: 2,
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    status: 'pending',
    type: 'telemedicine',
    reason: 'Follow-up',
    symptoms: 'Mild headache',
    notes: 'Need to discuss medication',
    doctorName: 'Dr. Johnson',
    hospitalName: 'General Medical Center',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
];

// Mock health data
const mockHealthData = {
  bloodPressure: [
    { date: '2023-01-01', systolic: 120, diastolic: 80 },
    { date: '2023-01-02', systolic: 118, diastolic: 78 },
    { date: '2023-01-03', systolic: 122, diastolic: 82 },
    { date: '2023-01-04', systolic: 121, diastolic: 79 },
    { date: '2023-01-05', systolic: 119, diastolic: 81 },
  ],
  heartRate: [
    { date: '2023-01-01', value: 72 },
    { date: '2023-01-02', value: 70 },
    { date: '2023-01-03', value: 74 },
    { date: '2023-01-04', value: 71 },
    { date: '2023-01-05', value: 73 },
  ],
  bloodGlucose: [
    { date: '2023-01-01', value: 95 },
    { date: '2023-01-02', value: 92 },
    { date: '2023-01-03', value: 97 },
    { date: '2023-01-04', value: 94 },
    { date: '2023-01-05', value: 96 },
  ],
  weight: [
    { date: '2023-01-01', value: 70.5 },
    { date: '2023-01-02', value: 70.3 },
    { date: '2023-01-03', value: 70.7 },
    { date: '2023-01-04', value: 70.4 },
    { date: '2023-01-05', value: 70.6 },
  ],
};

// Mock API functions
const mockApi = {
  // Auth API
  login: async (email, password) => {
    await simulateNetworkDelay();
    
    // For demo, accept any credentials
    const user = mockUsers[0];
    localStorage.setItem('token', 'demo-token');
    return user;
  },
  
  register: async (userData) => {
    await simulateNetworkDelay();
    
    // Create a new mock user
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    return { success: true, message: 'User registered successfully' };
  },
  
  sendOTP: async (phone) => {
    await simulateNetworkDelay();
    return { success: true, message: 'OTP sent successfully' };
  },
  
  verifyOTP: async (phone, otp) => {
    await simulateNetworkDelay();
    // For demo, accept any OTP
    return { success: true, message: 'OTP verified successfully' };
  },
  
  getUser: async () => {
    await simulateNetworkDelay();
    return mockUsers[0];
  },
  
  updateLanguage: async (language) => {
    await simulateNetworkDelay();
    mockUsers[0].preferred_language = language;
    return { success: true };
  },
  
  // Appointments API
  getAppointments: async () => {
    await simulateNetworkDelay();
    return mockAppointments;
  },
  
  bookAppointment: async (appointmentData) => {
    await simulateNetworkDelay();
    
    const newAppointment = {
      id: mockAppointments.length + 1,
      patient_id: 1,
      ...appointmentData,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockAppointments.push(newAppointment);
    return { success: true, appointment: newAppointment };
  },
  
  // Health data API
  getHealthData: async (type, timeRange) => {
    await simulateNetworkDelay();
    return mockHealthData[type] || [];
  },
};

// Helper function to simulate network delay
const simulateNetworkDelay = () => {
  const delay = getRandomInt(300, 800);
  return new Promise(resolve => setTimeout(resolve, delay));
};

export default mockApi;
