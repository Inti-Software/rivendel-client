import { login } from '../../auth/auth.api.js';
import { setAuthData } from "../../api/tokenStore.js";
import { useState } from "react";
import { DEAL } from '../../utils/Icons.jsx';

export function Login() {
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const doLogin = async () => {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const result = await login(email, password);
      if (result.error) {
        setError("El usuario o la contraseña son incorrectos.");
      } else {
        setError("");
        const data = result.data;
        setAuthData(data);
        window.location.href = "/reclamos";
      }
    };

    doLogin();
  };

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
          <input type="email" className="form-control" id="email" placeholder="caperucita@enelbosque.com" required 
            onInvalid={(e) => e.target.setCustomValidity("Ingrese un email")} onInput={(e) => e.target.setCustomValidity("")} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input type="password" className="form-control" id="password" placeholder="el lobo feroz" required 
            onInvalid={(e) => e.target.setCustomValidity("Ingrese una contraseña")} onInput={(e) => e.target.setCustomValidity("")} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
      </form>
      
    </div>
  );
}
