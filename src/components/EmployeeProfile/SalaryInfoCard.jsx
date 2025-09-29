import { DollarSign } from "lucide-react";
import { formatSalary } from "../../utils/formatSalary";

export default function SalaryInfoCard({ employee }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <DollarSign className="text-green-500" size={24} />
        المعلومات المالية
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">نوع الراتب</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg">
            {employee.salary_type || "—"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">الراتب</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg">
            {employee.salary_fixed
              ? formatSalary(employee.salary_fixed)
              : formatSalary(employee.salary_per_session)}
          </p>
        </div>
      </div>
    </div>
  );
}
