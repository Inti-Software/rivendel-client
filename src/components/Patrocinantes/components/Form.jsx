import ValidationErrors from "../../Shared/ValidationErrors";
import { handleSubmit } from '../eventHandlers.js';
import useForm from '../hooks/useForm.js';
import { Link, useNavigate } from 'react-router-dom';
import { isNew } from '../../Shared/utis.js';

export default function Form() {
	const navigate = useNavigate();
	const {state, dispatch} = useForm();

	const setField = (e) => {
		dispatch({ type: "SET_FIELD", field: e.target.id, value: e.target.value})
	}

	return (
		<div className="w-50 m-auto">
			<form onSubmit={(e) => handleSubmit(e, state, dispatch, navigate)}>
				<h3 className="mb-3">{isNew(state.id)? "Nuevo " : "Edición de "} Patrocinante</h3>
				{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}

				<div className="mb-3">
					<label htmlFor="nombre" className="form-label">Nombre</label>
					<input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} required autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="nroMatricula" className="form-label">Nº Matrícula</label>
					<input id="nroMatricula" type="number" className="form-control" value={state.nroMatricula} onChange={setField} autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="domicilio" className="form-label">Domicilio</label>
					<input id="domicilio" className="form-control" value={state.domicilio} onChange={setField} autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="localidad" className="form-label">Localidad</label>
					<input id="localidad" className="form-control" value={state.localidad} onChange={setField}  autoComplete="on"/>
				</div>
				<div className="mb-3">
					<label htmlFor="nroCasillero" className="form-label">Nº Casillero</label>
					<input id="nroCasillero" type="number" className="form-control" value={state.nroCasillero} onChange={setField} autoComplete="off" />
				</div>				
				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
						<Link to="/patrocinantes" className="btn btn-outline-primary">Cancelar</Link>
				</div>
			</form>
		</div>
	);
}
