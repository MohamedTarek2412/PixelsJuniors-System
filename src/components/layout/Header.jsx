import { Users, Search, Plus } from 'lucide-react';

const Header = ({ onAddEmployee, searchTerm, onSearchChange, totalEmployees }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 animate-fade-in">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">PJ</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient-orange">
              Pixels Juniors Academy
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>🎯 English</span>
              <span>💻 Programming</span>
              <span>🤖 Robotics</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600">إدارة الموظفين - تعليم البرمجة والروبوتكس والإنجليزية للأطفال</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Users size={16} />
          <span>{totalEmployees} موظف نشط</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="البحث عن موظف..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all w-full sm:w-64 input-focus"
          />
        </div>
        
        <button
          onClick={onAddEmployee}
          className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap animate-pulse-orange"
        >
          <Plus size={16} />
          إضافة موظف جديد
        </button>
      </div>
    </div>
  </div>
);
export default Header;
