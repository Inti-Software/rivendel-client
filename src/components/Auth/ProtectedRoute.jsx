import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthenticated, subscribe } from "../../auth/authState"

export default function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState(getAuthenticated());
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe((value) => {
      setIsAuth(value);
      setResolved(true);
    });

    // En caso de que ya esté resuelto
    setResolved(true);

    return unsubscribe;
  }, []);

  if (!resolved) {
    return <div>Loading session...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
