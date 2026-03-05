import { useCallback, useMemo } from 'react';
import { NotificationContext } from './Constants';
import { toast } from 'react-toastify';

const NotificationProvider = ({ children }) => {
  const defaultOptions = useMemo(() => ({ 
    style: { 
      fontSize: "12px",
      lineHeight: "12px",
      minHeight: "24px",
    }
  }), []);

  const showSuccess = useCallback((message, duration = 5000) => {
    toast.success(message, { ...defaultOptions, autoClose: duration, toastId: message });
  }, [defaultOptions]);

  const showError = useCallback((message, duration = 5000) => {
    toast.error(message, { ...defaultOptions, autoClose: duration, toastId: message });
  }, [defaultOptions]);

  const value = useMemo(() => ({ showSuccess, showError }), [showSuccess, showError]);
 
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;