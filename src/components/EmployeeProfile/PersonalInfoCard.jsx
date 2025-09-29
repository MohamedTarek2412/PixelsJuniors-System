import { User, Phone, Mail } from "lucide-react";

export default function PersonalInfoCard({ employee }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <User className="text-orange-500" size={24} />
        البيانات الشخصية
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">الاسم الكامل</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg">{employee.full_name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            {employee.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">الهاتف</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            {employee.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
