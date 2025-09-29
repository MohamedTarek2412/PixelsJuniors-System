const Notification = ({ type, message, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white animate-slide-up`}>
    <div className="flex items-center gap-2">
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75 transition-opacity">
        <X size={16} />
      </button>
    </div>
  </div>
);

export default Notification;