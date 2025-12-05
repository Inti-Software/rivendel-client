import { useEffect, useReducer } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Patrocinantes } from "../../utils/endpoints";
import ValidationErrors from "../Shared/ValidationErrors";
import { useNotification } from "../../contexts/Constants";

const initialState = {
  id: 0,
  nombre: "",
	nroMatricula: 0,
  domicilio: "",
  localidad: "",
  nroCasillero: 0,
  nroWhatsapp: "",
  initializing: true,
  loading: false,
  errors: [],
	isUpdate: false
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
				errors: []
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors
      };

    case "SUBMIT_START":
      return { 
				...state, 
				errors: [],
				loading: true 
			};

    case "SUBMIT_SUCCESS": 
      return initialState;

    case "SUBMIT_FAIL": {
			const errors = (typeof action.errors === "string") ?
							[action.errors || "Error en la solicitud"] :
							action.errors || ["Error en la solicitud"];
      return { 
				...state,
				errors: errors,
				loading: false 
			};
		}

		case "INITIAL_LOAD": 
			return { 
				...state,
				...action.payload,
				initializing: false,
				isUpdate: action.payload.nombre !== undefined
			};

    default:
      return state;
  }
}


export default function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
	const navigate = useNavigate();
	const { id } = useParams();
	const { showSuccess } = useNotification();

	useEffect(() => {
		if (isNaN(id)) return;

		try {
			const fetchData = async () => {
				const response = await Patrocinantes.get(id);
				if (response.ok) {
					const data = await response.json();
					dispatch({ type: "INITIAL_LOAD", payload: {
						id: data.id,
						nombre: data.nombre,
						nroMatricula: data.nroMatricula,
						domicilio: data.domicilio,
						localidad: data.localidad,
						nroCasillero: data.nroCasillero
					}});
				} else {					
					console.error(await response.json());
					dispatch({ type: "INITIAL_LOAD", payload: {} });
				}
			};
			fetchData();
		} catch (err) {
			console.error(err);
			dispatch({ type: "INITIAL_LOAD", payload: {} });
		}
	}, [id]);

	const validate = () => {
		const errors = [];
		if (state.nombre.trim() === "") errors.push("Ingrese el nombre del patrocinante");
		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const errors = validate();
		if (errors.length > 0) {
			dispatch({ type: "SET_ERRORS", errors });
			return;
		}

		dispatch({ type: "SUBMIT_START" });

		try {
			const patrocinante = {
				id: state.id, 
				nombre: state.nombre,
				nroMatricula: state.nroMatricula,
				domicilio: state.domicilio,
				localidad: state.localidad,
				nroCasillero: state.nroCasillero,
			};

			let result;
			if (isNaN(id))
				result = await Patrocinantes.create(patrocinante);
			else
				result = await	Patrocinantes.update(patrocinante);

			if (result.ok) {
				showSuccess(
					`El patrocinante ${state.nombre} se ${state.isUpdate ? "creó" : "actualizó"} correctamente.`
				);
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/patrocinantes");
			} else {				
				const errorData = await result.json();
				dispatch({ type: "SUBMIT_FAIL", errors: errorData.message });
			}
		} catch (err) {
			dispatch({ type: "SUBMIT_FAIL", errors: [err.message] });
		}
	};

	const setField = (e) => {
		dispatch({ type: "SET_FIELD", field: e.target.id, value: e.target.value})
	}

	return (
		<div className="w-50 m-auto">
			<form onSubmit={handleSubmit} >
				<h3 className="mb-3">{isNaN(id)? "Nuevo " : "Edición de "} Patrocinante</h3>
				{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}

				<div className="mb-3">
					<label htmlFor="nombre" className="form-label">Nombre</label>
					<input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} required />
				</div>
				<div className="mb-3">
					<label htmlFor="nroMatricula" className="form-label">Nº Matrícula</label>
					<input id="nroMatricula" type="number" className="form-control" value={state.nroMatricula} onChange={setField} />
				</div>
				<div className="mb-3">
					<label htmlFor="domicilio" className="form-label">Domicilio</label>
					<input id="domicilio" className="form-control" value={state.domicilio} onChange={setField} />
				</div>
				<div className="mb-3">
					<label htmlFor="localidad" className="form-label">Localidad</label>
					<input id="localidad" className="form-control" value={state.localidad} onChange={setField} />
				</div>
				<div className="mb-3">
					<label htmlFor="nroCasillero" className="form-label">Nº Casillero</label>
					<input id="nroCasillero" type="number" className="form-control" value={state.nroCasillero} onChange={setField} />
				</div>
				<div className="mb-3">
					<label htmlFor="nroWhatsapp" className="form-label">Nº Whatsapp</label>
					<input id="nroWhatsapp" className="form-control" value={state.nroWhatsapp} onChange={setField} />
				</div>
				
				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
						<Link to="/partes" className="btn btn-outline-primary">Cancelar</Link>
				</div>

				<pre>{JSON.stringify(state, null, 2)}</pre>
			</form>
		</div>
	);
}
