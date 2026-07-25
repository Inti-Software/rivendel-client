import { useState, useEffect } from 'react';
import { Health } from '../api/endpoints/health'

export function BackendStatusProvider({ children }) {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await Health.get();
        setIsBackendReady(true);
      } catch (err) {
        setIsBackendReady(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <BackendStatusContext.Provider value={{ isBackendReady, isChecking }}>
      {children}
    </BackendStatusContext.Provider>
  );
}

