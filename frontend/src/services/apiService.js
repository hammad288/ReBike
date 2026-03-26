import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  },
};

// Seller API calls
export const sellerAPI = {
  // Add new bike
  addBike: async (bikeData, token) => {
    try {
      const response = await api.post('/api/seller/bikes', bikeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add bike. Please try again.',
      };
    }
  },

  // Get seller's bikes
  getMyBikes: async (token) => {
    try {
      const response = await api.get('/api/seller/bikes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bikes.',
      };
    }
  },

  // Get single bike
  getBike: async (id, token) => {
    try {
      const response = await api.get(`/api/seller/bikes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bike details.',
      };
    }
  },

  // Update bike
  updateBike: async (id, bikeData, token) => {
    try {
      const response = await api.put(`/api/seller/bikes/${id}`, bikeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update bike.',
      };
    }
  },

  // Delete bike
  deleteBike: async (id, token) => {
    try {
      const response = await api.delete(`/api/seller/bikes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete bike.',
      };
    }
  },
};

// Public Bike API calls
export const bikeAPI = {
  // Get all approved bikes
  getApprovedBikes: async () => {
    try {
      const response = await api.get('/api/bikes/approved');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bikes.',
      };
    }
  },

  // Get single bike
  getBike: async (id) => {
    try {
      const response = await api.get(`/api/bikes/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bike details.',
      };
    }
  },
};

// ================= ADMIN API =================
export const adminAPI = {
  // Get all bikes
  getAllBikes: async (token) => {
    try {
      const response = await api.get('/api/bikes/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bikes',
      };
    }
  },

  // Get pending bikes
  getPendingBikes: async (token) => {
    try {
      const response = await api.get('/api/bikes/admin/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending bikes',
      };
    }
  },

  // Get approved bikes
  getApprovedBikes: async (token) => {
    try {
      const response = await api.get('/api/bikes/admin/approved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch approved bikes',
      };
    }
  },

  // Get rejected bikes
  getRejectedBikes: async (token) => {
    try {
      const response = await api.get('/api/bikes/admin/rejected', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch rejected bikes',
      };
    }
  },

  // Approve bike
  approveBike: async (id, token) => {
    try {
      const response = await api.put(`/api/bikes/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve bike',
      };
    }
  },

  // Reject bike
  rejectBike: async (id, reason, token) => {
    try {
      const response = await api.put(`/api/bikes/admin/reject/${id}`, 
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject bike',
      };
    }
  },

  // Delete bike
  deleteBike: async (id, token) => {
    try {
      const response = await api.delete(`/api/bikes/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete bike',
      };
    }
  },

  // Get dashboard stats
  getStats: async (token) => {
    try {
      const response = await api.get('/api/auth/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats',
      };
    }
  },

  // Get all users
  getUsers: async (token) => {
    try {
      const response = await api.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  },

  // Update user role
  updateUserRole: async (id, role, token) => {
    try {
      const response = await api.patch(`/api/auth/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update role',
      };
    }
  },

  // Delete user
  deleteUser: async (id, token) => {
    try {
      const response = await api.delete(`/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
      };
    }
  },
};

export default api;
