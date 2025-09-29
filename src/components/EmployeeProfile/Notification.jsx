export default function Notification({ message, type }) {
  return (
    <div
      className={`p-2 rounded-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
