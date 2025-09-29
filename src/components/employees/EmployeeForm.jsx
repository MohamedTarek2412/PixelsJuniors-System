import { useState } from 'react';
import { AlertCircle, Save, X } from 'lucide-react';

const validateEmployee = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'اسم الموظف مطلوب';
  if (!formData.phone.trim()) errors.phone = 'رقم الهاتف مطلوب';
  if (formData.salary_type === 'fixed' && formData.salary_fixed <= 0) {
    errors.salary_fixed = 'الراتب الثابت يجب أن يكون أكبر من الصفر';
  }
  if (formData.salary_type === 'per_session' && formData.salary_per_session <= 0) {
    errors.salary_per_session = 'راتب الجلسة يجب أن يكون أكبر من الصفر';
  }
  return errors;
};

export const EmployeeForm = ({ employee, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    phone: employee?.phone || '',
    salary_type: employee?.salary_type || 'fixed',
    salary_per_session: employee?.salary_per_session || 0,
    salary_fixed: employee?.salary_fixed || 0
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateEmployee(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSubmit(formData);
      } catch (err) {
        setErrors({ submit: 'حدث خطأ أثناء حفظ البيانات' });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-bounce-gentle">
        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {employee ? '✏️ تعديل بيانات الموظف' : '➕ إضافة موظف جديد'}
            </h3>
            <button 
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">👤 اسم الموظف</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
              placeholder="أدخل اسم الموظف"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.name}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📱 رقم الهاتف</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
              placeholder="01xxxxxxxxx"
              dir="ltr"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.phone}</p>}
          </div>

          {/* Salary Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">💰 نوع الراتب</label>
            <select
              value={formData.salary_type}
              onChange={(e) => updateFormData('salary_type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
            >
              <option value="fixed">راتب ثابت شهري</option>
              <option value="per_session">راتب بالجلسة</option>
            </select>
          </div>

          {/* Salary Amount */}
          {formData.salary_type === 'fixed' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💵 الراتب الثابت (جنيه مصري)</label>
              <input
                type="number"
                value={formData.salary_fixed}
                onChange={(e) => updateFormData('salary_fixed', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
                placeholder="2500"
                min="0"
                step="50"
              />
              {errors.salary_fixed && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.salary_fixed}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💴 راتب الجلسة (جنيه مصري)</label>
              <input
                type="number"
                value={formData.salary_per_session}
                onChange={(e) => updateFormData('salary_per_session', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
                placeholder="150"
                min="0"
                step="25"
              />
              {errors.salary_per_session && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.salary_per_session}</p>}
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 btn-primary px-4 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save size={16} />
                  {employee ? 'حفظ التعديلات' : 'إضافة الموظف'}
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeForm;