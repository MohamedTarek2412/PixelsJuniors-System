import { Users, Plus } from 'lucide-react';

export const EmptyState = ({ searchTerm, onAddEmployee }) => (
  <div className="col-span-full text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Users size={40} className="text-white" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">
        {searchTerm ? '🔍 لا توجد نتائج للبحث' : '👥 لا يوجد موظفين بعد'}
      </h3>
      <p className="text-gray-500 mb-8">
        {searchTerm 
          ? 'جرب البحث بكلمات أخرى أو تأكد من صحة الاسم أو رقم الهاتف' 
          : 'ابدأ ببناء فريقك التعليمي المميز في أكاديمية Pixels Juniors'
        }
      </p>
      {!searchTerm && (
        <button
          onClick={onAddEmployee}
          className="btn-primary px-8 py-4 rounded-lg font-medium inline-flex items-center gap-3 text-lg"
        >
          <Plus size={24} />
          إضافة أول موظف في الفريق
        </button>
      )}
    </div>
  </div>
);
export default EmptyState;