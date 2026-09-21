import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthenticated, getAuthResolved, subscribeAuthResolved, subscribe } from '../../stores/authState.js';
import WakeUpSpinner from '../Utils/WakeUpSpinner.jsx';

export default function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState(getAuthenticated());
  const [resolved, setResolved] = useState(getAuthResolved());

  useEffect(() => {
    const unsubscribeAuth = subscribe(setIsAuth);
    const unsubscribeResolved = subscribeAuthResolved(setResolved);
    return () => {
      unsubscribeAuth();
      unsubscribeResolved();
    };
  }, []);

  if (!resolved) {
    return <WakeUpSpinner message="Cargando la sesión del usuario..." />;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
