import { useReducer, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import ValidationErrors from "../Shared/ValidationErrors";
import { useNotification } from "../../contexts/Constants";
import { Partes, Resoluciones, TiposDocumento } from "../../utils/endpoints";
import DataBindedSelect from "../Forms/DataBindedSelect";
import { SEARCH } from "../../utils/Icons";
import SearchPatrocinanteDialog from './SearchPatrocinanteDialog'

const initialState = {
  id: 0,
  nombre: "",
  idTipoDocumento: 0,
  nroDocumento: "",
  cuil: "",
	patrocinante: {
		id: 0,
		nroMatricula: "",
		nombre: ""
	},
  nroWhatsapp: "",
  localidad: "",
  domicilio: "",
  initializing: true,
  loading: false,
	searchPatrocinante: false,
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

		case "SEARCH_PARTES":
			return { 
				...state, 
				searchPatrocinante: action.show
			};

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
	const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
		const fetchTiposDocumento = async () => {
			const response = await TiposDocumento.findAll()
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json()
			const td = data.map(d => ({
				value: d.id,
				text: d.descripcion
			}));
			setTiposDocumento(td);
		}

		fetchTiposDocumento();
	}, []);

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

	const esEnteroValido = (s) => {
		const nro = Number(s)
		return s?.trim() !== "" && !isNaN(nro) && Number.isInteger(nro)
	}

	const validate = () => {
		const errors = [];
		if (state.nombre.trim() === "") errors.push("Ingrese un nombre.");
		if (!esEnteroValido(state.nroDocumento)) errors.push("Ingrese un número de documento válido.")
		if (!esEnteroValido(state.cuil)) errors.push("Ingrese un cuil válido (sin espacios ni guiones).")
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
			const parte = {
				id: state.id,
				nombre: state.nombre,
				idTipoDocumento: state.idTipoDocumento,
				nroDocumento: state.nroDocumento,
				cuil: state.cuil,
				domicilio: state.domicilio,
				localidad: state.localidad,
				idPatrocinante: state.patrocinante.id,
				nroWhatsapp: state.nroWhatsapp,
			};

			let result;
			if (isNaN(id))
				result = await Partes.create(parte);
			else
				result = await	Partes.update(parte);

			if (result.ok) {
				showSuccess(`La parte ${state.nombre} se ${state.isUpdate ? "actualizó" : "creó"} correctamente.`);				
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/partes");
			} else {				
				const errorData = await result.json();
				dispatch({ type: "SUBMIT_FAIL", errors: errorData.message });
			}
		} catch (err) {
			dispatch({ type: "SUBMIT_FAIL", errors: [err.message] });
		}
	};

	const showSearchPatrocinante = (show) => {
		dispatch({ type: "SET_FIELD", field: "searchPatrocinante", value: show })
	}

  const onAcceptSearchPatrocinante = (e, patrocinante) => {
    e.preventDefault();
		dispatch({ type: "SET_FIELD", field: "patrocinante", value: patrocinante })
		showSearchPatrocinante(false)
  }
  
	const setField = (e) => {
		dispatch({ type: "SET_FIELD", field: e.target.id, value: e.target.value})
	}

	const getPatrocinante = (p) => {
		if (p.nroMatricula?.trim() !== "" && p.nombre?.trim() !== "") {
			 return	`${p.nroMatricula} - ${p.nombre}`
		}

		return ""
	}

	return (
		<div className="w-50 m-auto">
			<form onSubmit={handleSubmit} style={{ padding: 20 }}>
				<h3 className="mb-3">{isNaN(id)? "Nueva " : "Edición de "} Parte</h3>
				{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
				
				{state.searchPatrocinante && (
						<SearchPatrocinanteDialog handleAccept={onAcceptSearchPatrocinante} 
							handleCancel={() => showSearchPatrocinante(false) } />
						) }
				<div className="mb-3">
					<label htmlFor="nombre" className="form-label">Nombre</label>
					<input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} required />
				</div>
				<div className="mb-3">
						<label htmlFor="nroDocumento" className="form-label">Documento</label>
					<div className="row g-3">
						<div className="col">
							<DataBindedSelect id={"idTipoDocumento"} data={tiposDocumento} selectedValue={state.idTipoDocumento} 
								setSelectedValue={(v) => dispatch({ type: "SET_FIELD", field: "idTipoDocumento", value: parseInt(v) }) } />
						</div>
						<div className="col">
							<input id="nroDocumento" type="number" className="form-control" value={state.nroDocumento} onChange={setField} />
						</div>
					</div>
				</div>
				<div className="mb-3">
					<label htmlFor="cuil" className="form-label">CUIL</label>
					<input id="cuil" className="form-control" value={state.cuil} onChange={setField} />
					<span className="form-text d-block text-end">0 si es el mismo que el documento</span>
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
					<label htmlFor="patrocinante" className="form-label">Patrocinante</label>
					<div className="row g-3">
						<div className="col-10">
							<input id="patrocinante" className="form-control bg-dark-subtle" 
								value={getPatrocinante(state.patrocinante)}
								readOnly={true} tabIndex={-1}/>
						</div>
						<div className="col-2">
							<button type="button" className="btn btn-outline-primary me-2" onClick={() => showSearchPatrocinante(true)} >
								{SEARCH}
							</button>							
						</div>
					</div>
				</div>
				<div className="mb-3">
					<label htmlFor="nroWhatsapp" className="form-label">Nº WhatsApp</label>
					<input id="nroWhatsapp" type="number" className="form-control" value={state.nroWhatsapp} onChange={setField} />
				</div>

				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
						<Link to="/resoluciones" className="btn btn-outline-primary">Cancelar</Link>
				</div>

				<pre>{JSON.stringify(state, null, 2)}</pre>

			</form>
	</div>				
	);
}