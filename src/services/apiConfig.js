// services/apiConfig.js
// =============================================================================
// API Configuration and Constants
// =============================================================================

// Base Configuration
export const API_CONFIG = {
  // Base URL - يمكن تغييره حسب بيئة العمل
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost/pixels-academy/api',
  
  // Request timeout (milliseconds)
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

// API Endpoints
export const ENDPOINTS = {
  // Employee endpoints
  EMPLOYEES: {
    BASE: '/employees',
    GET_ALL: '/employees',
    GET_BY_ID: (id) => `/employees?id=${id}`,
    CREATE: '/employees',
    UPDATE: (id) => `/employees?id=${id}`,
    DELETE: (id) => `/employees?id=${id}`
  },
  
  // Future endpoints for expansion
  STUDENTS: {
    BASE: '/students',
    GET_ALL: '/students',
    GET_BY_ID: (id) => `/students?id=${id}`,
    CREATE: '/students',
    UPDATE: (id) => `/students?id=${id}`,
    DELETE: (id) => `/students?id=${id}`
  },
  
  COURSES: {
    BASE: '/courses',
    GET_ALL: '/courses',
    GET_BY_ID: (id) => `/courses?id=${id}`,
    CREATE: '/courses',
    UPDATE: (id) => `/courses?id=${id}`,
    DELETE: (id) => `/courses?id=${id}`
  },
  
  // Reports and analytics
  REPORTS: {
    EMPLOYEE_STATS: '/reports/employees',
    SALARY_SUMMARY: '/reports/salary-summary'
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  // Success codes
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client error codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  
  // Server error codes
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  SERVER_ERROR: 'خطأ في الخادم، يرجى المحاولة لاحقاً',
  TIMEOUT: 'انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى',
  UNAUTHORIZED: 'غير مصرح لك بالوصول',
  FORBIDDEN: 'ليس لديك صلاحية لتنفيذ هذا الإجراء',
  NOT_FOUND: 'البيانات المطلوبة غير موجودة',
  VALIDATION_ERROR: 'خطأ في البيانات المدخلة',
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع'
};

// Request Configuration Templates
export const REQUEST_CONFIGS = {
  // GET request with timeout
  GET: {
    method: 'GET',
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS
  },
  
  // POST request with data
  POST: (data) => ({
    method: 'POST',
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
    body: JSON.stringify(data)
  }),
  
  // PUT request with data
  PUT: (data) => ({
    method: 'PUT',
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
    body: JSON.stringify(data)
  }),
  
  // DELETE request
  DELETE: {
    method: 'DELETE',
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS
  }
};

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Feature flags
  FEATURES: {
    ENABLE_LOGGING: process.env.REACT_APP_ENABLE_LOGGING === 'true',
    ENABLE_CACHE: process.env.REACT_APP_ENABLE_CACHE === 'true',
    ENABLE_RETRY: process.env.REACT_APP_ENABLE_RETRY !== 'false', // enabled by default
    MOCK_API: process.env.REACT_APP_MOCK_API === 'true'
  }
};

// Cache Configuration
export const CACHE_CONFIG = {
  EMPLOYEE_LIST_TTL: 5 * 60 * 1000, // 5 minutes
  EMPLOYEE_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
  STATS_TTL: 2 * 60 * 1000 // 2 minutes
};

// Validation Rules
export const VALIDATION_RULES = {
  EMPLOYEE: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    PHONE_REGEX: /^01[0-9]{9}$/,
    SALARY_MIN: 1,
    SALARY_FIXED_MAX: 100000,
    SALARY_PER_SESSION_MAX: 5000
  }
};

// API Response Formats
export const RESPONSE_FORMATS = {
  SUCCESS: {
    success: true,
    data: null,
    message: ''
  },
  ERROR: {
    success: false,
    error: '',
    code: null
  }
};

// Utility function to build full URL
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Utility function to get error message by status code
export const getErrorMessage = (statusCode) => {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

// Debug logging utility
export const apiLogger = {
  request: (method, url, data = null) => {
    if (ENV_CONFIG.FEATURES.ENABLE_LOGGING) {
      console.group(`🚀 API Request: ${method} ${url}`);
      console.log('📤 Data:', data);
      console.log('⏰ Time:', new Date().toISOString());
      console.groupEnd();
    }
  },
  
  response: (method, url, response, duration) => {
    if (ENV_CONFIG.FEATURES.ENABLE_LOGGING) {
      console.group(`✅ API Response: ${method} ${url}`);
      console.log('📥 Data:', response);
      console.log('⚡ Duration:', `${duration}ms`);
      console.log('⏰ Time:', new Date().toISOString());
      console.groupEnd();
    }
  },
  
  error: (method, url, error, duration) => {
    if (ENV_CONFIG.FEATURES.ENABLE_LOGGING) {
      console.group(`❌ API Error: ${method} ${url}`);
      console.error('💥 Error:', error);
      console.log('⚡ Duration:', `${duration}ms`);
      console.log('⏰ Time:', new Date().toISOString());
      console.groupEnd();
    }
  }
};

// Mock data for development/testing
export const MOCK_DATA = {
  EMPLOYEES: [
    {
      id: 1,
      name: "أحمد محمد علي",
      phone: "01234567890",
      salary_type: "fixed",
      salary_per_session: 0,
      salary_fixed: 3000,
      created_at: "2024-01-15 10:30:00"
    },
    {
      id: 2,
      name: "فاطمة علي حسن",
      phone: "01098765432",
      salary_type: "per_session",
      salary_per_session: 150,
      salary_fixed: 0,
      created_at: "2024-02-20 14:15:00"
    },
    {
      id: 3,
      name: "محمد حسام الدين",
      phone: "01156789012",
      salary_type: "fixed",
      salary_per_session: 0,
      salary_fixed: 2500,
      created_at: "2024-03-10 09:45:00"
    }
  ]
};

// Export default configuration object
export default {
  API_CONFIG,
  ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  REQUEST_CONFIGS,
  ENV_CONFIG,
  CACHE_CONFIG,
  VALIDATION_RULES,
  buildApiUrl,
  getErrorMessage,
  apiLogger,
  MOCK_DATA
};