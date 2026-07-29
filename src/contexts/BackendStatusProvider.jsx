import { useState, useEffect } from 'react';
import { Health } from '../api/endpoints/health';
import { BackendStatusContext } from './Constants';
import { getBackendDown, subscribeBackendStatus } from '../api/backendStatusStore';

export function BackendStatusProvider({ children }) {
  const [isBackendDown, setIsBackendDown] = useState(getBackendDown());
  //const isBackendDown = getBackendDown();

  useEffect(() => {
    setIsBackendDown(getBackendDown());
    const unsubscribe = subscribeBackendStatus(setIsBackendDown);

    const checkBackend = async () => {
      try {
        await Health.get();
        setIsBackendDown(false);
      } catch (err) {
        setIsBackendDown(true);
      }
    };

    checkBackend();

    return unsubscribe;
  }, []);

  return (
    <BackendStatusContext.Provider value={{ isBackendDown }}>
      {children}
    </BackendStatusContext.Provider>
  );
}
