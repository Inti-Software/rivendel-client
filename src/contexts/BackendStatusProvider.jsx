import { useState, useEffect } from 'react';
import { BackendStatusContext } from './Constants';
import { getBackendDown, subscribeBackendStatus } from '../stores/backend-status';

export function BackendStatusProvider({ children }) {
  const [isBackendDown, setIsBackendDown] = useState(getBackendDown());

  useEffect(() => subscribeBackendStatus(setIsBackendDown), []);

  return (
    <BackendStatusContext.Provider value={{ isBackendDown }}>
      {children}
    </BackendStatusContext.Provider>
  );
}
