import { useCallback, useMemo, useState } from 'react';
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

  const properties = useMemo(() => ({ 
    onClose: setInvisible, 
    style: { 
      fontSize: "12px",
      lineHeight: "12px",
      minHeight: "24px",
    }
  }), []);

  const showSuccess = useCallback((message, duration = 5000) => {
    setNotification({ message, visible: true, duration });
    toast.success(message, properties);
  }, [properties]);

  const showError = useCallback((message, duration = 5000) => {
    setNotification({ message, visible: true, duration });
    toast.error(message, properties);
  }, [properties]);

  const value = useMemo(() => ({ notification, showSuccess, showError }), [notification, showSuccess, showError]);
 
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;