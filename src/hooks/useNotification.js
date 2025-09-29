import { useState } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};