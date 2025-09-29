import axios from "axios";

const API_URL = "http://localhost/pixels-website/backend/api/employees";

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
  return token ? `Bearer ${token}` : null;
};

export const getAllEmployees = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required - please login first');
    }

    console.log('Making request to get all employees with token');
    
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    console.log('getAllEmployees response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('انتهت صلاحية تسجيل الدخول - يرجى تسجيل الدخول مرة أخرى');
    }
    
    throw error;
  }
};

export const getEmployee = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('معرف الموظف غير صحيح');
    }

    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required - please login first');
    }

    console.log('Fetching employee with ID:', id, 'and token');

    const response = await axios.get(`${API_URL}?id=${id}`, {
      timeout: 10000,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    console.log('getEmployee response:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching employee:', error);
    
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const authError = new Error('انتهت صلاحية تسجيل الدخول - يرجى تسجيل الدخول مرة أخرى');
        authError.response = error.response;
        throw authError;
      }
      
      const message = error.response.data?.error || error.response.data?.message || 'حدث خطأ غير متوقع';
      const customError = new Error(message);
      customError.response = error.response;
      throw customError;
      
    } else if (error.request) {
      const networkError = new Error('خطأ في الاتصال بالخادم');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    } else {
      throw new Error(error.message || 'حدث خطأ أثناء جلب بيانات الموظف');
    }
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required - please login first');
    }
    
    const response = await axios.post(API_URL, employeeData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeUser('user');
    }
    
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required - please login first');
    }
    
    const response = await axios.put(`${API_URL}?id=${id}`, employeeData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required - please login first');
    }
    

    const response = await axios.delete(`${API_URL}?id=${id}`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    throw error;
  }
};