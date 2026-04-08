import { useReducer, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import ValidationErrors from "../Shared/ValidationErrors";
import { Partes } from "../../api/endpoints/partes";
import { TiposDocumento } from "../../api/endpoints/tiposDocumentos";
import DataBindedSelect from "../Forms/DataBindedSelect";
import { SEARCH } from "../Shared/Icons";
import SearchPatrocinanteDialog from "../Patrocinantes/SearchPatrocinanteDialog";

const initialState = {
  id: 0,
  nombre: "",
  idTipoDocumento: 0,
  nroDocumento: "",
  cuil: "",
	enableCuil: true,
	patrocinante: {
		id: 0,
		nroMatricula: 0,
		nombre: ""
	},
	esApoderado: false,
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
			if (action.field === "enableCuil" && !action.value) {
				return {
					...state,
					enableCuil: false,
					cuil: "",
					errors: []
				};
			}
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
	const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
		const fetchTiposDocumento = async () => {
			const result = await TiposDocumento.findAll()
			if (!result.ok) {
				throw new Error(`Error al obtener tipos de documentos: ${result.error}`);
			}

			const td = result.data.data.map(d => ({
				value: d.id,
				text: d.descripcion
			}));
			setTiposDocumento(td);
			dispatch({ type: "SET_FIELD", field: "idTipoDocumento", value: 1 })
		}

		fetchTiposDocumento();
		document.getElementById('nombre').focus()
	}, []);

	useEffect(() => {
		if (isNaN(id)) return;

		try {
			const fetchData = async () => {
				const response = await Partes.get(id);
				if (response.error) {
					dispatch({ type: "INITIAL_LOAD", payload: {} });
				}
				const data = response.data;
				dispatch({ type: "INITIAL_LOAD", payload: {
					id: data.id,
					nombre: data.nombre,
					idTipoDocumento: data.idTipoDocumento,
					nroDocumento: data.nroDocumento,
					enableCuil: data.cuil.trim() !== "" && data.cuil != "0",
					cuil: data.cuil,
					patrocinante: {
						id: data.patrocinante?.id || 0,
						nombre: data.patrocinante?.nombre || "",
						nroMatricula: data.patrocinante?.nroMatricula || 0
					},
					esApoderado: data.esApoderado,
					localidad: data.localidad,
					domicilio: data.domicilio,
				}});
			};
			fetchData();
		} catch {
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
		if (state.enableCuil && (!esEnteroValido(state.cuil) || (state.cuil == "0")))
			errors.push("Ingrese un cuil válido.")
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
				esApoderado: state.esApoderado
			};

			let result;
			if (isNaN(id))
				result = await Partes.create(parte);
			else
				result = await	Partes.update(parte);

			if (result.ok) {
				const mensaje = `La parte ${state.nombre} se ${state.isUpdate ? "actualizó" : "creó"} correctamente.`;
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/partes", { state: { successMsg: mensaje }});
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
		if (e.target.type === "checkbox") {
			dispatch({ type: "SET_FIELD", field: e.target.id, value: e.target.checked })
		} else {
			let v = e.target.value;
			if (e.target.id === "cuil") {
				v = e.target.value.replace(/\D/g, '');
			}
			dispatch({ type: "SET_FIELD", field: e.target.id, value: v })
		}
	}

	const getPatrocinante = (p) => {
		if (p.nroMatricula > 0 && p.nombre?.trim() !== "") {
			 return	`${p.nroMatricula} - ${p.nombre}`
		}

		return ""
	}

	function formatCuil(value = "") {
		const digits = value.replace(/\D/g, "").padEnd(11, " ");
		return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
	}

	function handleChangeLabelCuil() {
		dispatch({ type: "SET_FIELD", field: "enableCuil", value: !state.enableCuil })
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
					<input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} 
						required autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="nroDocumento" className="form-label">Documento</label>
					<div className="row g-3">
						<div className="col">
							<DataBindedSelect id={"idTipoDocumento"} data={tiposDocumento} selectedValue={state.idTipoDocumento} 
								setSelectedValue={(v) => dispatch({ type: "SET_FIELD", field: "idTipoDocumento", value: parseInt(v) }) } />
						</div>
						<div className="col">
							<input id="nroDocumento" type="number" className="form-control" value={state.nroDocumento} 
								onChange={setField} autoComplete="off" />
						</div>
					</div>
				</div>
				<div className="mb-3">
					<label htmlFor="cuil" className="form-label" onClick={handleChangeLabelCuil}>
							<input id="enableCuil" type="checkbox" checked={state.enableCuil} onChange={() => {}} /> CUIL
					</label>
					<input id="cuil" className="form-control text-start" placeholder="  -        - "
						value={formatCuil(state.cuil)} onChange={setField} disabled={!state.enableCuil} 
						style={{ backgroundColor: state.enableCuil? "#fff" : "#aaa" }}
						autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="domicilio" className="form-label">Domicilio</label>
					<input id="domicilio" className="form-control" value={state.domicilio} 
						onChange={setField} autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="localidad" className="form-label">Localidad</label>
					<input id="localidad" className="form-control" value={state.localidad} 
						onChange={setField} autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="patrocinante" className="form-label">Patrocinante</label>
					<div className="row g-3">
						<div className="col-11">
							<input id="patrocinante" className="form-control bg-dark-subtle" 
								value={getPatrocinante(state.patrocinante)}
								readOnly={true} tabIndex={-1}/>
						</div>
						<div className="col-1">
							<button type="button" className="btn btn-outline-primary me-2" onClick={() => showSearchPatrocinante(true)} >
								{SEARCH}
							</button>							
						</div>
					</div>
					<div className="d-flex mt-1">
						<label className="me-2 small">
								<input id="esApoderado" type="checkbox" checked={state.esApoderado} onChange={setField} /> Es apoderado
						</label>
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading || state.searchPatrocinante} type="submit" className="btn btn-primary me-2">
							{state.loading? "Grabando...":"Grabar"}
						</button>
						<Link to="/partes" className="btn btn-outline-primary">Cancelar</Link>
				</div>

			</form>

	</div>
	);
}