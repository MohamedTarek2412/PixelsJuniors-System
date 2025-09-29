import { useState, useEffect } from "react";
import { getEmployee } from "../services/employeeService";

export default function useEmployee(id) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployee() {
      if (!id) {
        setLoading(false);
        setEmployee(null);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching employee with ID:", id);
        
        const data = await getEmployee(id);
        console.log("Employee API Response:", data);
        
        if (data && data.employee) {
          setEmployee(data.employee);
        } else if (data) {
          setEmployee(data);
        } else {
          setEmployee(null);
        }
        
      } catch (err) {
        console.error("Error fetching employee:", err);
        
        if (err.response) {
          switch (err.response.status) {
            case 404:
              setError("الموظف غير موجود");
              break;
            case 401:
              setError("غير مصرح لك بعرض بيانات هذا الموظف");
              break;
            case 500:
              setError("خطأ في الخادم - حاول مرة أخرى");
              break;
            default:
              setError("حدث خطأ أثناء جلب بيانات الموظف");
          }
        } else if (err.code === 'NETWORK_ERROR') {
          setError("خطأ في الاتصال بالإنترنت");
        } else {
          setError("فشل في تحميل بيانات الموظف");
        }
        
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  const refetch = () => {
    if (id) {
      setError(null);
      setLoading(true);
    }
  };

  return [employee, loading, error, refetch];
}