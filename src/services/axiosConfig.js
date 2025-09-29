// services/axiosConfig.js
import axios from 'axios';

// إنشاء axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost/pixels-website/backend',
  timeout: 10000,
});

// إضافة interceptor للطلبات الصادرة لإضافة التوكن تلقائياً
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request:', config.url, 'Token exists:', !!token);
    } else {
      console.log('No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// إضافة interceptor للاستجابات لمعالجة خطأ 401
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.config?.url, 'Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid, clearing storage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // إعادة توجيه لصفحة تسجيل الدخول
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        alert('انتهت صلاحية تسجيل الدخول - سيتم إعادة توجيهك لصفحة تسجيل الدخول');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;