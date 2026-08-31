import { useNavigate, Link } from "react-router-dom";
import ValidationErrors from "../../Shared/ValidationErrors";
import { Button } from "../../GoogleCalendar/components/Button";
import useForm from "../hooks/useForm";
import { handleSubmit } from '../eventHandlers.js';

export default function Form() {
	const { state, connected, dispatch, setField } = useForm();
	const navigate = useNavigate();

	return (
		<div className="w-50 m-auto">
			<form onSubmit={(e) => handleSubmit(e, state, dispatch, navigate)}>
				<h3 className="mb-3">Configuración</h3>
				{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
				<div className="row">
					<div className="col-9">
						<div className="mb-3">
							<label htmlFor="nombre" className="form-label">Nombre</label>
							<input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} required autoComplete="off" />
						</div>
					</div>
					<div className="col-3">
						<div className="mb-3">
							<label htmlFor="nroHabilitacion" className="form-label">Nº Habilitación</label>
							<input id="nroHabilitacion" className="form-control text-center" type="number" value={state.nroHabilitacion} onChange={setField} required autoComplete="off" />
						</div>
					</div>
				</div>
				<div className="card mb-2 border-danger">
					<div className="card-header h6 fw-bold text-danger border-danger">Cambiar contraseña</div>
					<div className="card-body">
						<div className="mb-3">
							<label htmlFor="password" className="form-label">Contraseña actual</label>
							<input id="password" className="form-control" type="password" value={state.password} onChange={setField} autoComplete="off" />
						</div>
						<div className="mb-3">
							<label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
							<input id="newPassword" className="form-control" type="password" value={state.newPassword} onChange={setField} autoComplete="off" />
						</div>
						<div className="mb-3">
							<label htmlFor="newPasswordRepeated" className="form-label">Repita la nueva contraseña</label>
							<input id="newPasswordRepeated" className="form-control" type="password" value={state.newPasswordRepeated} onChange={setField} autoComplete="off" />
						</div>
					</div>
				</div>
				<div className="card mb-3 border-primary">
					<div className="card-header h6 fw-bold text-primary border-primary">Google Calendar</div>
					<div className="card-body">
						<p className="text-gray small" style={{ fontSize: "0.75em"}}>
							{connected ? "Tu calendario está conectado para sincronizar eventos." : "Conecta tu calendario para sincronizar eventos."}
						</p>
						<Button />
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
						<Link to="/" className="btn btn-outline-primary">Cancelar</Link>
				</div>
			</form>
		</div>
	);
}
