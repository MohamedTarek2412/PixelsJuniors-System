import { Calendar, Phone, DollarSign, Edit, Trash2 } from 'lucide-react';

const formatSalary = (amount) => {
  return amount.toLocaleString('ar-EG');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-EG');
};

export const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const getSalaryDisplay = () => {
    if (employee.salary_type === 'fixed') {
      return `${formatSalary(employee.salary_fixed)} جنيه (ثابت)`;
    }
    return `${formatSalary(employee.salary_per_session)} جنيه (بالجلسة)`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group card-hover">
      <div className="bg-gradient-to-r from-orange-400 to-yellow-500 h-3"></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {getInitials(employee.name)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">{employee.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={14} />
                انضم في {formatDate(employee.created_at)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={() => onEdit(employee)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-110"
              title="تعديل بيانات الموظف"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(employee.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-110"
              title="حذف الموظف"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Phone size={16} className="text-orange-400" />
            <span className="font-medium" dir="ltr">{employee.phone}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <DollarSign size={16} className="text-green-500" />
            <span className="font-medium">{getSalaryDisplay()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            employee.salary_type === 'fixed'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {employee.salary_type === 'fixed' ? '📊 راتب ثابت' : '⏱️ راتب متغير'}
          </span>
        </div>
      </div>
    </div>
  );
};
export default EmployeeCard;