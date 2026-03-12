import { useEffect, useReducer } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Users } from "../../api/endpoints/users";
import ValidationErrors from "../Shared/ValidationErrors";

const initialState = {
  nombre: "",
	password: "",
	newPassword: "",
	newPasswordRepeated: "",
  initializing: true,
  loading: false,
  errors: []
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
				initializing: false
			};

    default:
      return state;
  }
}

export default function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			const response = await Users.get(id);
			if (response.ok) {
				const data = response.data;
				dispatch({ type: "INITIAL_LOAD", payload: { nombre: data }});
			} else {					
				dispatch({ type: "INITIAL_LOAD", payload: { errors: [response.error] } });
			}
		};
		fetchData();
	}, [id]);

	const validate = () => {
		const errors = [];
		if (state.nombre.trim() === "") errors.push("Ingrese un nombre.");
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
			const user = {
				nombre: state.nombre,
				currentPassword: state.password,
				newPassword: state.newPassword,
				passwordConfirmation: state.newPasswordRepeated
			};

			let result;
			result = await Users.update(user);

			if (result.ok) {
				const mensaje = `Sus datos se actualizaron correctamente.`;
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/reclamos", { state: { successMsg: mensaje }});
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
			<form onSubmit={handleSubmit}>
				<h3 className="mb-3">Configuración</h3>
				{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
				<div className="mb-3">
					<label htmlFor="nombre" className="form-label">Nombre</label>
					<input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} required autoComplete="off" />
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
				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
						<Link to="/patrocinantes" className="btn btn-outline-primary">Cancelar</Link>
				</div>
			</form>
		</div>
	);
}
