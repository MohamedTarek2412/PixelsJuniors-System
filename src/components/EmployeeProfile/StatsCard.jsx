export default function StatsCard({ title, value }) {
  return (
    <div className="bg-blue-50 p-4 rounded-2xl shadow-md text-center">
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
