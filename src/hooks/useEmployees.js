import { useState, useEffect } from 'react';
import { 
  getAllEmployees, 
  createEmployee as createEmployeeService, 
  updateEmployee as updateEmployeeService, 
  deleteEmployee as deleteEmployeeService 
} from '../services/employeeService';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('Token exists in useEmployees:', !!token);
      
      if (!token) {
        setError('يرجى تسجيل الدخول أولاً');
        setEmployees([]);
        return;
      }
      
      const data = await getAllEmployees();
      console.log("API Response:", data);
      
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      if (err.response?.status === 401) {
        setError('غير مصرح لك بعرض البيانات - يرجى تسجيل الدخول');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        setError('فشل في جلب بيانات الموظفين');
      }
      setEmployees([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const createEmployee = async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      
      const formattedData = {
        full_name: employeeData.name || employeeData.full_name,
        email: employeeData.email,
        phone: employeeData.phone,
        salary_type: employeeData.salary_type,
        salary_fixed: employeeData.salary_type === 'fixed' ? employeeData.salary_fixed : 0,
        salary_per_session: employeeData.salary_type === 'per_session' ? employeeData.salary_per_session : 0,
        role: employeeData.role || 'employee'
      };

      const response = await createEmployeeService(formattedData);
      console.log("Created employee:", response);

      await fetchEmployees();
      
      return response;
    } catch (err) {
      console.error('Error creating employee:', err);
      if (err.response?.status === 401) {
        setError('غير مصرح لك بإضافة موظفين - يرجى تسجيل الدخول');
      } else {
        setError('فشل في إضافة الموظف');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id, employeeData) => {
    setLoading(true);
    setError(null);
    try {

      const formattedData = {
        full_name: employeeData.name || employeeData.full_name,
        email: employeeData.email,
        phone: employeeData.phone,
        salary_type: employeeData.salary_type,
        salary_fixed: employeeData.salary_type === 'fixed' ? employeeData.salary_fixed : 0,
        salary_per_session: employeeData.salary_type === 'per_session' ? employeeData.salary_per_session : 0,
        role: employeeData.role || 'employee'
      };

      const response = await updateEmployeeService(id, formattedData);
      console.log("Updated employee:", response);
      
   
      await fetchEmployees();
      
      return response;
    } catch (err) {
      console.error('Error updating employee:', err);
      if (err.response?.status === 401) {
        setError('غير مصرح لك بتعديل بيانات الموظفين - يرجى تسجيل الدخول');
      } else {
        setError('فشل في تحديث الموظف');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEmployeeService(id);
      console.log("Deleted employee with id:", id);
      
 
      await fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      if (err.response?.status === 401) {
        setError('غير مصرح لك بحذف الموظفين - يرجى تسجيل الدخول');
      } else {
        setError('فشل في حذف الموظف');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setError(null);
    fetchEmployees();
  };

  return {
    employees,
    loading,
    error,
    initialLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refetch,
    fetchEmployees
  };
};