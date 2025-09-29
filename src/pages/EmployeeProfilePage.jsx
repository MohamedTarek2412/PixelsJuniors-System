import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useEmployee from "../hooks/useEmployee";
import ProfileHeader from "../components/EmployeeProfile/ProfileHeader";
import PersonalInfoCard from "../components/EmployeeProfile/PersonalInfoCard";
import SalaryInfoCard from "../components/EmployeeProfile/SalaryInfoCard";

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const [actualId, setActualId] = useState(null);
  
  useEffect(() => {
    // إذا الـ URL param مش صحيح، جرب تاخد من localStorage
    if (!id || id === 'undefined' || id === '{user.id}') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log("Got user from localStorage:", user);
          setActualId(user.id);
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
    } else {
      // تحويل الـ ID لرقم والتأكد من صحته
      const numericId = parseInt(id);
      if (!isNaN(numericId) && numericId > 0) {
        setActualId(numericId);
      } else {
        console.error("Invalid ID:", id);
        setActualId(null);
      }
    }
  }, [id]);
  
  console.log("URL Param ID:", id);
  console.log("Actual ID to use:", actualId);
  
  // استخدام array destructuring بدلاً من object destructuring
  const [employee, loading, error] = useEmployee(actualId);

  if (!actualId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">لم يتم العثور على معرف الموظف</h2>
          <p className="text-gray-600 mb-4">يرجى تسجيل الدخول مرة أخرى</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل بيانات الموظف...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">حدث خطأ</h3>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
            >
              إعادة المحاولة
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">الموظف غير موجود</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على الموظف المطلوب</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <ProfileHeader employee={employee} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PersonalInfoCard employee={employee} />
        </div>
        <div>
          <SalaryInfoCard employee={employee} />
        </div>
      </div>
    </div>
  );
}