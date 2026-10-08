import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Patients
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  getMedicalHistory: (id) => api.get(`/patients/${id}/medical-history`),
};

// Doctors
export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  addSchedule: (id, data) => api.post(`/doctors/${id}/schedule`, data),
  getAppointments: (id, params) => api.get(`/doctors/${id}/appointments`, { params }),
};

// Nurses
export const nurseAPI = {
  getAll: (params) => api.get('/nurses', { params }),
  create: (data) => api.post('/nurses', data),
  update: (id, data) => api.put(`/nurses/${id}`, data),
  delete: (id) => api.delete(`/nurses/${id}`),
};

// Appointments
export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
};

// Prescriptions
export const prescriptionAPI = {
  getAll: (params) => api.get('/prescriptions', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
};

// Lab
export const labAPI = {
  getTests: () => api.get('/lab/tests'),
  createTest: (data) => api.post('/lab/tests', data),
  getOrders: (params) => api.get('/lab/orders', { params }),
  createOrder: (data) => api.post('/lab/orders', data),
  createReport: (data) => api.post('/lab/reports', data),
};

// Pharmacy
export const pharmacyAPI = {
  getMedications: (params) => api.get('/pharmacy/medications', { params }),
  createMedication: (data) => api.post('/pharmacy/medications', data),
  updateMedication: (id, data) => api.put(`/pharmacy/medications/${id}`, data),
  getInventory: (params) => api.get('/pharmacy/inventory', { params }),
  createInventory: (data) => api.post('/pharmacy/inventory', data),
  updateInventory: (id, data) => api.put(`/pharmacy/inventory/${id}`, data),
  createOrder: (data) => api.post('/pharmacy/orders', data),
  dispenseOrder: (id) => api.put(`/pharmacy/orders/${id}/dispense`),
};

// Rooms
export const roomAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  create: (data) => api.post('/rooms', data),
  assign: (data) => api.post('/rooms/assign', data),
  discharge: (assignmentId) => api.put(`/rooms/discharge/${assignmentId}`),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Billing
export const billingAPI = {
  getAll: (params) => api.get('/billing', { params }),
  getById: (id) => api.get(`/billing/${id}`),
  create: (data) => api.post('/billing', data),
  pay: (id, data) => api.post(`/billing/${id}/pay`, data),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
  getEquipment: () => api.get('/admin/equipment'),
  createEquipment: (data) => api.post('/admin/equipment', data),
};

// Emergency
export const emergencyAPI = {
  getAll: (params) => api.get('/emergency', { params }),
  create: (data) => api.post('/emergency', data),
  update: (id, data) => api.put(`/emergency/${id}`, data),
};

// Feedback
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  create: (data) => api.post('/feedback', data),
};

// FAQ
export const faqAPI = {
  getAll: (params) => api.get('/faq', { params }),
  create: (data) => api.post('/faq', data),
  update: (id, data) => api.put(`/faq/${id}`, data),
  delete: (id) => api.delete(`/faq/${id}`),
};

// Chatbot
export const chatbotAPI = {
  query: (message) => api.post('/chatbot/query', { message }),
};

// AI
export const aiAPI = {
  symptomCheck: (symptoms) => api.post('/ai/symptom-check', { symptoms }),
  recommendDoctor: (data) => api.post('/ai/recommend-doctor', data),
};

// Notifications
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  readAll: () => api.put('/notifications/read-all'),
  read: (id) => api.put(`/notifications/${id}/read`),
};

export default api;
