import { createContext, useContext } from 'react';

export const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const BackendStatusContext = createContext();
export const useBackendStatus = () => useContext(BackendStatusContext);