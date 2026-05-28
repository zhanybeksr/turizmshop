import axios from 'axios';

const API_URL = 'https://turizmshop-backend-2y5m.onrender.com/api';

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

// Исправленный интерцептор
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Просто добавляем токен в заголовок, больше ничего
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;