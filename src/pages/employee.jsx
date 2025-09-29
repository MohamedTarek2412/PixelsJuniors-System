import { useState } from 'react';
import { Users, DollarSign, AlertCircle } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useNotification } from '../hooks/useNotification'; // مؤقتاً
import Header from '../components/layout/Header';
import StatsCard from '../components/common/StatsCard';
 import Notification from '../components/common/Notification'; // مؤقتاً
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/employees/EmptyState';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeCard from '../components/employees/EmployeeCard';

const formatSalary = (amount) => {
  return amount.toLocaleString('ar-EG');
};

const EmployeeDashboard = () => {
  const { 
    employees, 
    loading, 
    error, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    refetch 
  } = useEmployees();
  
  // const { notification, showNotification, hideNotification } = useNotification(); // مؤقتاً
  
  // Notification state مؤقت
  const [notification, setNotification] = useState(null);
  
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  
  const hideNotification = () => {
    setNotification(null);
  };
  
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Filter employees based on search term - تعديل للحقول الصحيحة + حماية من undefined
  const filteredEmployees = (employees || []).filter(employee =>
    (employee.full_name || employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.phone || '').includes(searchTerm)
  );

  // Calculate statistics - تعديل للحقول الصحيحة + حماية من undefined
  const stats = {
    total: (employees || []).length,
    fixed: (employees || []).filter(emp => emp.salary_type === 'fixed').length,
    perSession: (employees || []).filter(emp => emp.salary_type === 'per_session').length,
    totalSalary: (employees || []).reduce((sum, emp) => {
      return sum + (emp.salary_type === 'fixed' ? (emp.salary_fixed || 0) : (emp.salary_per_session || 0));
    }, 0)
  };

  const handleFormSubmit = async (employeeData) => {
    setFormLoading(true);
    try {
      // تحويل البيانات للتنسيق المطلوب
      const formattedData = {
        full_name: employeeData.name || employeeData.full_name,
        email: employeeData.email,
        phone: employeeData.phone,
        salary_type: employeeData.salary_type,
        salary_fixed: employeeData.salary_type === 'fixed' ? employeeData.salary_fixed : 0,
        salary_per_session: employeeData.salary_type === 'per_session' ? employeeData.salary_per_session : 0,
        role: employeeData.role || 'employee'
      };

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formattedData);
        showNotification('success', 'تم تحديث بيانات الموظف بنجاح');
      } else {
        await createEmployee(formattedData);
        showNotification('success', 'تم إضافة الموظف بنجاح');
      }
      setShowForm(false);
      setEditingEmployee(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'حدث خطأ غير متوقع';
      showNotification('error', errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (employee) => {
    // تحويل البيانات للتنسيق المتوقع في الفورم
    const formattedEmployee = {
      ...employee,
      name: employee.full_name || employee.name
    };
    setEditingEmployee(formattedEmployee);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟\nلا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await deleteEmployee(id);
        showNotification('success', 'تم حذف الموظف بنجاح');
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'فشل في حذف الموظف';
        showNotification('error', errorMessage);
      }
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-pixels"
      style={{
        background: `linear-gradient(135deg, 
          rgb(35, 31, 32) 0%, 
          rgb(36, 30, 32) 25%, 
          rgb(33, 31, 32) 50%, 
          rgb(35, 30, 34) 75%, 
          rgb(36, 32, 33) 100%)`
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header
          onAddEmployee={handleAddEmployee}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalEmployees={employees.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="إجمالي الموظفين"
            value={stats.total}
            icon={<Users className="text-white" size={24} />}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            title="موظفين براتب ثابت"
            value={stats.fixed}
            icon={<DollarSign className="text-white" size={24} />}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatsCard
            title="موظفين براتب متغير"
            value={stats.perSession}
            icon={<DollarSign className="text-white" size={24} />}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatsCard
            title="إجمالي الرواتب"
            value={`${formatSalary(stats.totalSalary)} ج.م`}
            icon={<DollarSign className="text-white" size={24} />}
            color="bg-gradient-to-r from-orange-400 to-yellow-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3 animate-slide-up">
            <AlertCircle size={24} className="text-red-500" />
            <div className="flex-1">
              <p className="font-medium">حدث خطأ في النظام</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={refetch} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.length === 0 ? (
              <EmptyState 
                searchTerm={searchTerm} 
                onAddEmployee={handleAddEmployee} 
              />
            ) : (
              filteredEmployees.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  employee={{
                    ...employee,
                    name: employee.full_name || employee.name // تأكد من وجود name للكارد
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}

        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEmployee(null);
            }}
            loading={formLoading}
          />
        )}

        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <p>{notification.message}</p>
              <button
                onClick={hideNotification}
                className="ml-4 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">PJ</span>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-xl text-gray-800">Pixels Juniors Academy</h4>
              <p className="text-sm text-gray-500">Building Tomorrow's Digital Minds</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">English Language</span>
            <span className="flex items-center gap-1">Programming</span>
            <span className="flex items-center gap-1">Robotics</span>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            نحن نؤمن بأن كل طفل لديه القدرة على أن يصبح مبرمجًا ومبدعًا. 
            نقدم تعليمًا عالي الجودة في البرمجة والروبوتكس واللغة الإنجليزية لبناء جيل واعٍ ومتميز تقنيًا.
          </p>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">© 2024 Pixels Juniors Academy. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;