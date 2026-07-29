import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthenticated, subscribe } from "../../auth/authState"
import WakeUpSpinner from '../Utils/WakeUpSpinner.jsx';
import { getBackendDown, subscribeBackendStatus } from "../../api/backendStatusStore";
import { BACKEND_STATUS_ERROR } from '../../api/backendStatusStore';

export default function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState(getAuthenticated());
  const [resolved, setResolved] = useState(false);
  const [isBackendDown, setIsBackendDown] = useState(getBackendDown());  

  useEffect(() => {
    setIsBackendDown(getBackendDown());

    const unsubscribeAuth = subscribe((value) => {
      setIsAuth(value);
      setResolved(true);
    });
    
    const unsubscribeBackend = subscribeBackendStatus((value) => {
      setIsBackendDown(value);
    });    

    setResolved(true);

    return () => {
      unsubscribeAuth();
      unsubscribeBackend();
    };
  }, []);

  if (isBackendDown === BACKEND_STATUS_ERROR) {
    return <WakeUpSpinner message="Iniciando el servidor, puede tardar unos segundos..." />;
  }

  if (!resolved) {
    return <WakeUpSpinner message="Cargando la sesión del usuario..." />;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
