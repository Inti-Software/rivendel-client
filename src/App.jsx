import { login } from "./auth/auth.api.js";
import { setAuthData, getToken } from "./api/tokenStore.js";
import { useState, useEffect } from "react";
import { DEAL } from './components/Shared/Icons';
import { Navigate } from 'react-router-dom';

function App() {
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const doLogin = async () => {
      setLoading(true);
      const email = e.target.email.value;
      const password = e.target.password.value;
      const result = await login(email, password);
      if (result.error) {
        setError(result.message || "Error al iniciar sesión.");
      } else {
        const data = result.data;
        setAuthData(data);
        setError("");
        setRedirect(true);
      }
      setLoading(false);
    };

    doLogin();
  };

  useEffect(() => {
    if (getToken()) {
      setRedirect(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to="/reclamos" />;
  }

  return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="mb-2">
          <span style={{ width: "32px" }} className='d-inline-block text-success me-1'><DEAL /></span>        
          Conciliaciones
        </h1>
        {error && <div className="alert alert-danger small p-2">{error}</div>}
        <form className="w-25" onSubmit={handleLogin} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" id="email" placeholder="usuario@example.com" required 
              onInvalid={(e) => e.target.setCustomValidity("Ingrese un email")} onInput={(e) => e.target.setCustomValidity("")} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="password" placeholder="123456" required 
              onInvalid={(e) => e.target.setCustomValidity("Ingrese una contraseña")} onInput={(e) => e.target.setCustomValidity("")} />
          </div>
          <button disabled={loading} type="submit" className="btn btn-primary w-100">{loading? "Iniciando...":"Iniciar"} sesión</button>
        </form>
        
      </div>
    );
}

export default App;
