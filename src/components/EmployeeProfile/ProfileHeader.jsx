import { formatData } from "../../utils/formatData";

export default function ProfileHeader({ employee }) {
  const formatted = formatData(employee);

  if (!formatted) return null;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mb-4">
      <h1 className="text-xl font-bold">{formatted.name}</h1>
      <p className="text-gray-600">{formatted.position}</p>
      <p className="text-gray-500">{formatted.department}</p>
    </div>
  );
}
