import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication services
export const authService = {
  register: (userData) => api.post('/users/register/', userData),
  login: (credentials) => api.post('/users/login/', credentials),
  getProfile: () => api.get('/users/me/'),
  updateProfile: (profileData) => api.patch('/users/profile/', profileData),
};

// Product services
export const productService = {
  getCategories: () => api.get('/products/categories/'),
  getProducts: (params) => api.get('/products/products/', { params }),
  getProductById: (id) => api.get(`/products/products/${id}/`),
};

// Order services
export const orderService = {
  getOrders: () => api.get('/orders/orders/'),
  getOrderById: (id) => api.get(`/orders/orders/${id}/`),
  createOrder: (orderData) => api.post('/orders/orders/', orderData),
  updateOrder: (id, orderData) => api.patch(`/orders/orders/${id}/`, orderData),
  deleteOrder: (id) => api.delete(`/orders/orders/${id}/`),
};

// Immediately setup request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Add token to every request
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 