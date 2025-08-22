import { useState } from 'react';
import { NotificationContext } from './Constants';

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    visible: false,
  });

  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type, visible: true });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, duration);
  };
  
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};