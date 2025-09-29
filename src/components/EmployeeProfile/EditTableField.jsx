export default function EditableField({ label, value, onChange, name }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
