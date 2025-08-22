import { useState } from 'react';
import { NotificationContext } from './Constants';

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    visible: false,
  });

  const showNotification = (message, duration = 3000) => {
    setNotification({ message, type: "information", visible: true });   
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, duration);
  };

  const showError = (message, duration = 3000) => {
    setNotification({ message, type: "danger", visible: true });

    if (duration > 0) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, duration);
    }
  }
  
  return (
    <NotificationContext.Provider value={{ notification, showNotification, showError }}>
      {children}
    </NotificationContext.Provider>
  );
};