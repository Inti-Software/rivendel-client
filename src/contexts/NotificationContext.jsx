import { useState } from 'react';
import { NotificationContext } from './Constants';
import { toast } from 'react-toastify';

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    visible: false,
    duration: 5000,
  });

  const setInvisible = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  }

  const properties = { 
    onClose: setInvisible, 
    style: { 
      fontSize: "12px",
      lineHeight: "12px",
      minHeight: "24px",
    }
  };

  const showSuccess = (message, duration = 5000) => {
    setNotification({ message, visible: true, duration });
    toast.success(message, properties);
  };

  const showError = (message, duration = 5000) => {
    setNotification({ message, visible: true, duration });
    toast.error(message, properties);
  };
 
  return (
    <NotificationContext.Provider value={{ notification, showSuccess, showError }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;