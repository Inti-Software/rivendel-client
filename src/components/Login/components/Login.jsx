import { DEAL } from '../../Shared/Icons.jsx'
import { Navigate } from 'react-router-dom';
import useForm from "../hooks/useForm.js";
import { handleLogin } from '../eventHandlers.js';

function Login() {
	const { state, dispatch, setField } = useForm();

  if (state.redirect) {
    return <Navigate to="/reclamos" />;
  }

  return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="mb-2">
          <span style={{ width: "32px" }} className='d-inline-block text-success me-1'><DEAL /></span>        
          Conciliaciones
        </h1>
        {state.error && <div className="alert alert-danger small p-2">{state.error}</div>}
        <form className="w-25" onSubmit={(e) => handleLogin(e, state, dispatch)} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" id="email" placeholder="usuario@example.com" onChange={setField}
							value={ state.email || ''} name={"email"} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="position-relative d-block">
              <input type={state.showPassword ? "text" : "password"} className="form-control" id="password" placeholder="********" 
								onChange={setField} value={ state.password || '' } name={"password"} />
              <button type="button" onClick={() => dispatch({ type: 'TOGGLE_SHOW_PASSWORD' })}
                className="btn position-absolute top-50 end-0 translate-middle-y" tabIndex={-1}
                aria-label={state.showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {state.showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button disabled={state.loading} type="submit" className="btn btn-primary w-100">
						{state.loading? "Iniciando sesión...":"Iniciar sesión"}
					</button>
        </form>
        
      </div>
    );
}

export default Login;
