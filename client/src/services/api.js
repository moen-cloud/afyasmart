import axios from 'axios';

// IMPORTANT: Must match your backend URL with /api prefix
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Triage APIs
export const triageAPI = {
  create: (data) => api.post('/triage', data),
  getMyTriages: (params) => api.get('/triage/my-triages', { params }),
  getById: (id) => api.get(`/triage/${id}`),
  getAll: (params) => api.get('/triage/all', { params }),
  review: (id, data) => api.put(`/triage/${id}/review`, data),
  getStats: () => api.get('/triage/stats'),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getDoctors: () => api.get('/appointments/doctors'),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  addPrescription: (id, data) => api.put(`/appointments/${id}/prescription`, data),
};

// Medical Record APIs
export const recordAPI = {
  create: (data) => api.post('/records', data),
  getMyRecords: () => api.get('/records/my-records'),
  getPatientRecords: (patientId) => api.get(`/records/patient/${patientId}`),
  getById: (id) => api.get(`/records/${id}`),
  update: (id, data) => api.put(`/records/${id}`, data),
};

// Chat APIs
export const chatAPI = {
  startChat: (receiverId) => api.post('/chat/start', { receiverId }),
  getChats: () => api.get('/chat'),
  getMessages: (chatId) => api.get(`/chat/${chatId}/messages`),
  sendMessage: (chatId, content) => api.post(`/chat/${chatId}/messages`, { content }),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  verifyDoctor: (id) => api.put(`/admin/doctors/${id}/verify`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;