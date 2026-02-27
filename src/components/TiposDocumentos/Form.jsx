import { useReducer, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import ValidationErrors from "../Shared/ValidationErrors";
import { useNotification } from "../../contexts/Constants";
import { TiposDocumento } from "../../api/endpoints/tiposDocumentos";

const initialState = {
  id: 0,
  sintetico: "",
  descripcion: "",
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
				const response = await TiposDocumento.get(id);
				let payload = initialState;
				if (response.ok) {
					payload = {
						id: response.data.id,
						sintetico: response.data.sintetico,
						descripcion: response.data.descripcion
					};
				}
				dispatch({ type: "INITIAL_LOAD", payload });
			};
			fetchData();
		} catch (err) {
			console.error(err);
			dispatch({ type: "INITIAL_LOAD", payload: {} });
		}
	}, [id]);

	const validate = () => {
		const errors = [];
		if (state.sintetico.trim() === "") errors.push("Ingrese un sintético.");
		if (state.descripcion.trim() === "") errors.push("Ingrese una descripción.")
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
			const tipoDocumento = {
				id: state.id, 
				sintetico: state.sintetico,
				descripcion: state.descripcion
			};

			let result;
			if (isNaN(id))
				result = await TiposDocumento.create(tipoDocumento);
			else
				result = await	TiposDocumento.update(tipoDocumento);

			if (result.ok) {
				showSuccess(`El tipo de documento "${state.sintetico}" ha sido ${isNaN(id) ? "creado" : "actualizado"} exitosamente.`);
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/tipos-documentos");
			} else {				
				dispatch({ type: "SUBMIT_FAIL", errors: result.error });
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
			<form onSubmit={handleSubmit} style={{ padding: 20 }} autoComplete="off">
				<h3 className="mb-3">{isNaN(id)? "Nuevo " : "Edición de "} Tipo de Documento</h3>
				{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}

				<div className="mb-3">
					<label htmlFor="sintetico" className="form-label">Sintético</label>
					<input id="sintetico" className="form-control" type="text" value={state.sintetico} onChange={setField} required />
				</div>
				<div className="mb-3">
					<label htmlFor="descripcion" className="form-label">Descripción</label>
					<input id="descripcion" className="form-control" value={state.descripcion} onChange={setField} />
				</div>
				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
						<Link to="/tipos-documentos" className="btn btn-outline-primary">Cancelar</Link>
				</div>

			</form>
		</div>
	);
}
