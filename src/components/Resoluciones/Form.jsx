import { useReducer, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import ValidationErrors from "../Shared/ValidationErrors";
import { useNotification } from "../../contexts/Constants";
import { Resoluciones } from "../../api/endpointsConfiguration";

const initialState = {
  id: 0,
  descripcion: "",
  detalle: "",
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
				isUpdate: action.payload.id !== undefined
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
				const response = await Resoluciones.get(id);
				if (response.ok) {
					const data = await response.json();
					dispatch({ type: "INITIAL_LOAD", payload: {
						id: data.id,
						descripcion: data.descripcion,
						detalle: data.detalle
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
		if (state.descripcion.trim() === "") errors.push("Ingrese la descripción.");
		if (state.detalle.trim() === "") errors.push("Ingrese un detalle.")
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
				descripcion: state.descripcion,
				detalle: state.detalle
			};

			let result;
			if (isNaN(id))
				result = await Resoluciones.create(patrocinante);
			else
				result = await	Resoluciones.update(patrocinante);

			if (result.ok) {
				const descripcion = state.descripcion.substring(0, 25) +
						(state.descripcion.length > 25 ? "..." : "");
				showSuccess(`La resolución ${descripcion} se ${state.isUpdate ? "actualizó" : "creó"} correctamente.`);
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/resoluciones");
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
		<form onSubmit={handleSubmit} style={{ padding: 20 }}>
		  <h3 className="mb-3">{isNaN(id)? "Nuevo " : "Edición de "} Reclamo</h3>
			{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
				
			<div className="mb-3">
				<label htmlFor="descripcion" className="form-label">Descripción</label>
				<input id="descripcion" className="form-control" value={state.descripcion} onChange={setField} />
			</div>
			<div className="mb-3">
				<label htmlFor="detalle" className="form-label">Detalle</label>
				<textarea id="detalle" className="form-control" type="memo" value={state.detalle} onChange={setField} required rows={7} />
			</div>

			<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
					<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
					<Link to="/resoluciones" className="btn btn-outline-primary">Cancelar</Link>
			</div>
		</form>
	);
}
