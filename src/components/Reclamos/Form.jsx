import { useReducer, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import SearchParteDialog from "../Partes/SearchParteDialog";
import { Resoluciones, Reclamos } from "../../utils/endpoints";
import DataBindedSelect from "../Forms/DataBindedSelect";
import ValidationErrors from "../Shared/ValidationErrors";
import dayjs from "dayjs";

const initialState = {
  id: 0,
  numero: 0,
  rubros: "",
  idResolucion: 0,
  fechaHoraInicio: "",
  horaFin: "",
  reclamantes: [],
  reclamados: [],
	searchPartes: {
		show: false,
		esReclamante: true
	},
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
		case "SEARCH_PARTES":
			return { 
				...state, 
				searchPartes: { 
					show: action.show, 
					esReclamante: action.esReclamante 
				} 
			};

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
	const [resoluciones, setResoluciones] = useState([]);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchResoluciones = async () => {
			const response = await Resoluciones.findAll({currentPage: 1, recordsPerPage: 100});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const resolucionesData = data.data.map((r) => ({
				value: r.id,
				text: r.descripcion
			}));
			resolucionesData.unshift({ value: 0, text: "-- Seleccione una resolución --" });
			setResoluciones(resolucionesData);
		}
		fetchResoluciones();
	}, []);

	useEffect(() => {
		if (isNaN(id)) return;

		try {
			const fetchData = async () => {
				const response = await Reclamos.get(id);
				if (response.ok) {
					const data = await response.json();
					const fechaHoraInicio = dayjs(data.fechaHoraInicio, "DD/MM/YYYY HH:mm", true).isValid()? 
						dayjs(data.fechaHoraInicio, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm") : "";
					dispatch({ type: "INITIAL_LOAD", payload: {
						id: data.id,
						numero: data.numero,
						rubros: data.rubros,
						idResolucion: isNaN(data.idResolucion)? 0 : parseInt(data.idResolucion),
						fechaHoraInicio: fechaHoraInicio,
						horaFin: data.horaFin == null ? "" : data.horaFin,
						reclamantes: data.reclamantes,
						reclamados: data.reclamados
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
    if (state.numero <= 0) errors.push("Ingrese un número de reclamo válido");
    if (!state.fechaHoraInicio) errors.push("Ingrese una fecha y hora de inicio");
    if (!dayjs(state.fechaHoraInicio, "YYYY-MM-DDTHH:mm", true).isValid())
      errors.push("Ingrese una fecha y hora de inicio válidas");
    if (dayjs(state.horaFin, "HH:mm", true).isValid())
      errors.push("Ingrese una hora de fin válida");
		if (state.idResolucion <= 0) errors.push("Seleccione una resolución válida");
    return errors;
  };

	const combinarHoraConFecha = function (horaStr, fechaBase = dayjs()) {  
  const [horas, minutos] = horaStr.split(':').map(Number); // "14:30"

  if (isNaN(horas) || isNaN(minutos)) {
    throw new Error("Formato de hora inválido. Debe ser 'hh:mm'.");
  }

  let fechaConHora = fechaBase
    .hour(horas)
    .minute(minutos)
    .second(0)
    .millisecond(0);

  return fechaConHora.format('YYYY-MM-DDTHH:mm:ss');
}

const handleSubmit = async (e) => {
	e.preventDefault();

	const errors = validate();
	if (errors.length > 0) {
		dispatch({ type: "SET_ERRORS", errors });
		return;
	}

	dispatch({ type: "SUBMIT_START" });

	try {
		const reclamo = {
			id: state.id, 
			numero: state.numero, 
			rubros: state.rubros, 
			idResolucion: state.idResolucion,
			fechaHoraInicio: state.fechaHoraInicio, 
			horaFin: state.horaFin === "" ? null : combinarHoraConFecha(state.horaFin, dayjs(state.fechaHoraInicio)),
			reclamantes: state.reclamantes.map(r => r.id),
			reclamados: state.reclamados.map(r => r.id)
		};

		let result;
		if (isNaN(id))
			result = await Reclamos.create(reclamo);
		else
			result = await	Reclamos.update(reclamo);

		if (result.ok) {
			dispatch({ type: "SUBMIT_SUCCESS" });
			navigate("/reclamos");
		} else {				
			const errorData = await result.json();
			dispatch({ type: "SUBMIT_FAIL", errors: errorData.message });
		}
	} catch (err) {
		dispatch({ type: "SUBMIT_FAIL", errors: [err.message] });
	}
};

	const addParte = (isReclamante) => {
		dispatch({ type: "SEARCH_PARTES", show: true, esReclamante: isReclamante })
	}

	const removeParte = (id, isReclamante) => {
		const partes = isReclamante ? state.reclamantes : state.reclamados;
		const f = isReclamante ? "reclamantes" : "reclamados";
		const v = partes.filter(p => p.id !== id);
		dispatch({ type: "SET_FIELD", field: f, value: v });
	}

	const onAcceptSearchParte = (e, parte) => {
		e.preventDefault();
		const partes = state.searchPartes.esReclamante ? state.reclamantes : state.reclamados;
		if (!partes.find(r => r.id === parte.id)) {
			const f = state.searchPartes.esReclamante ? "reclamantes" : "reclamados";
			const v = [...partes, parte];
			dispatch({ type: "SET_FIELD", field: f, value: v });
		}
		dispatch({ type: "SEARCH_PARTES", show: false});
	}

	const partesTable = (esReclamante) => {
		const partes = esReclamante ? state.reclamantes : state.reclamados;
		const title = esReclamante ? "Reclamantes" : "Reclamados";
		return (
				<div className="mb-3">
					<table className="table table-sm text-center">
						<thead>
							<tr>
								<th colSpan={3} className="fw-bold text-bg-secondary">{title}</th>
							</tr>
							<tr>
								<th className="text-bg-secondary border-1">CUIL</th>
								<th className="text-bg-secondary border-1">Nombre</th>
								<th className="text-bg-secondary border-1"></th>
							</tr>
						</thead>
						<tbody>
							{partes.map((p) => (
								<tr key={p.id}>
									<td>{p.cuil}</td>
									<td>{p.nombre}</td>
									<td className="text-danger" >
										<button type="button" className="btn btn-sm btn-outline-danger"
											onClick={() => removeParte(p.id, esReclamante)}>
											-
										</button>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={2}>
									<button type="button" className="btn btn-sm btn-outline-secondary"
										onClick={() => addParte(esReclamante)}>
										Agregar {title.slice(0, -1)}
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
		);
	}

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
			{state.searchPartes.show && (
				<SearchParteDialog handleAccept={onAcceptSearchParte} 
					handleCancel={() => dispatch({ type: "SEARCH_PARTES", show: false })} />
				) }

		  <h3 className="mb-3">{isNaN(id)? "Nuevo " : "Edición de "} Reclamo</h3>
			{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
			<div className="row">
				<div className="col-md-2 mb-3">
					<label htmlFor="numero" className="form-label">Número</label>
					<input id="numero" placeholder="Número" className="form-control text-end" type="number" value={state.numero} 
						onChange={(e) => dispatch({ type: "SET_FIELD", field: "numero", value: parseInt(e.target.value) })} required />
				</div>
				<div className="col-md-3 mb-3">
					<label htmlFor="fechaHoraInicio" className="form-label">Fecha y Hora de Inicio</label>
					<input id="fechaHoraInicio" placeholder="AAAA-MM-DD HH:MM" className="form-control text-center" type="datetime-local" value={state.fechaHoraInicio} 
						onChange={(e) => dispatch({ type: "SET_FIELD", field: "fechaHoraInicio", value: e.target.value })} />
				</div>
				<div className="col-md-1 mb-3">
					<label htmlFor="horaFin" className="form-label">Hora de Fin</label>
					<input id="horaFin" placeholder="HH:MM" className="form-control text-center" type="time" value={state.horaFin} 
						onChange={(e) => dispatch({ type: "SET_FIELD", field: "horaFin", value: e.target.value })} />
				</div>
				<div className="col-md-6 mb-3">
					<label htmlFor="idResolucion" className="form-label">Resolución</label>
					<DataBindedSelect data={resoluciones} selectedValue={state.idResolucion} 
						setSelectedValue={(v) => dispatch({ type: "SET_FIELD", field: "idResolucion", value: parseInt(v) })} />
				</div>
			</div>

			<div className="mb-3">
				<label htmlFor="rubros" className="form-label">Rubros</label>
				<textarea className="form-control" id="rubros" rows="5" placeholder="Objetos del reclamo/rubros y períodos..."
					onChange={(e) => dispatch({ type: "SET_FIELD", field: "rubros", value: e.target.value })}>					
				</textarea>
			</div>

			<div className="mb-3">
				<div className="mb-3">
					<span className="h5 text-primary">Partes Involucradas</span>
				</div>
				{partesTable(true)}
				{partesTable(false)}
			</div>

			<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
					<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
					<Link to="/partes" className="btn btn-outline-primary">Cancelar</Link>
			</div>

    <pre>{JSON.stringify(state, null, 2)}</pre>
    </form>

  );
}
