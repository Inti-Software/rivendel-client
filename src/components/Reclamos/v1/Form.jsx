import { useReducer, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import SearchParteDialog from "../../Partes/SearchParteDialog";
import { Reclamos } from "../../../api/endpoints/reclamos";
import { Partes } from "../../../api/endpoints/partes";
import DataBindedSelect from "../../Forms/DataBindedSelect";
import ValidationErrors from "../../Shared/ValidationErrors";
import dayjs from "dayjs";
import { DELETE, PLUSCIRCLE } from "../../Shared/Icons";
import { NO_ESPECIFICADO } from "../../Shared/constants";
import { POSTERGADO, RESOLUCIONES } from "../../Resoluciones/tiposResoluciones";

const initialState = {
  id: 0,
  numero: 0,
  fechaHoraInicio: "",
  horaFin: "",
  idResolucion: 0,
	proxAudiencia: "",
  rubros: "",
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

	useEffect(() => {
		if (isNaN(id)) return;

		try {
			const fetchData = async () => {
				const result = await Reclamos.get(id);
				if (result.ok) {
					const data = await result.data;
					const fechaHoraInicio = dayjs(data.fechaHoraInicio, "DD/MM/YYYY HH:mm", true).isValid()? 
						dayjs(data.fechaHoraInicio, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm") : "";
					const horafin = data.horaFin == null ? "" : dayjs(data.horaFin, "HH:mm", true).isValid() ?
						dayjs(data.horaFin, "HH:mm").format("HH:mm") : ""; 
					const proxAudiencia = data.proximaAudiencia == null ? "" : dayjs(data.proximaAudiencia, "DD/MM/YYYY HH:mm", true).isValid() ?
						dayjs(data.proximaAudiencia, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm") : "";
					dispatch({ type: "INITIAL_LOAD", payload: {
						id: data.id,
						numero: data.numero,
						rubros: data.rubros,
						idResolucion: isNaN(data.idResolucion)? 0 : parseInt(data.idResolucion),
						fechaHoraInicio: fechaHoraInicio,
						horaFin: horafin,
						proxAudiencia: proxAudiencia,
						reclamantes: data.reclamantes,
						reclamados: data.reclamados
					}});
				} else {					
					dispatch({ type: "INITIAL_LOAD", payload: {} });
				}
			};
			fetchData();
		} catch (err) {
			dispatch({ type: "INITIAL_LOAD", payload: { errors: [err.message]} });
		}
	}, [id]);

	const setField = (e) => {
		let v = e.target.value;
		switch (e.target.id) {
			case "numero":
				v = parseInt(e.target.value.replace(/\D/g, ''));
				break;
			default:
				if (e.target.type === "checkbox") {
					v = e.target.checked
				}
				break;
		}
		dispatch({ type: "SET_FIELD", field: e.target.id, value: v })
	}

  const validate = () => {
    const errors = [];
    if (state.numero <= 0) errors.push("Ingrese un número de reclamo válido");
    if (!state.fechaHoraInicio) errors.push("Ingrese una fecha y hora de inicio");
    if (!dayjs(state.fechaHoraInicio, "YYYY-MM-DDTHH:mm", true).isValid())
      errors.push("Ingrese una fecha y hora de inicio válidas");
    if (dayjs(state.horaFin, "HH:mm", true).isValid())
      errors.push("Ingrese una hora de fin válida");
		if (state.idResolucion <= 0) errors.push("Seleccione una resolución válida");
    if (state.proxAudiencia && !dayjs(state.proxAudiencia, "YYYY-MM-DDTHH:mm", true).isValid())
      errors.push("Ingrese una próxima fecha válida");

		const inicio = dayjs(state.fechaHoraInicio)
		const prox = dayjs(state.proxAudiencia)
		if (inicio.isAfter(prox)) {
			errors.push("La próxima fecha no puede ser anterior a la fecha hora de inicio.")
		}
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

		const parteToParteDTO = (p) => {
			return {
				idParte: p.id,
				nroWhatsappParte: p.nroWhatsappParte || null,
				nroWhatsappPatrocinante: p.nroWhatsappPatrocinante || null,
				postergo: p.postergo || false,
				incomparendo: p.incomparendo || false,
				multado: p.multado || false
			};
		}

		try {
			const reclamo = {
				id: state.id, 
				numero: state.numero, 
				rubros: state.rubros, 
				idResolucion: state.idResolucion,
				fechaHoraInicio: state.fechaHoraInicio, 
				horaFin: state.horaFin === "" ? null : combinarHoraConFecha(state.horaFin, dayjs(state.fechaHoraInicio)),
				proximaAudiencia: state.proxAudiencia === "" ? null : state.proxAudiencia,
				reclamantes: state.reclamantes.map(parteToParteDTO),
				reclamados: state.reclamados.map(parteToParteDTO)
			};

			let result;
			if (isNaN(id))
				result = await Reclamos.create(reclamo);
			else
				result = await	Reclamos.update(reclamo);

			if (result.ok) {
				const mensaje = "El reclamo Nº " + state.numero + 
					` se ${isNaN(id) ? "creó" : "actualizó" } correctamente.`;
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/reclamos", { state: { successMsg: mensaje }});
			} else {
				dispatch({ type: "SUBMIT_FAIL", errors: result.error });
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

	const getParte = async (id, field, partes) => {
		try {
			const fetch = async () => {
				const response = await Partes.get(id);
				if (!response.ok) {
					throw new Error(`Error al obtener los datos de la parte seleccionada: ${response.status} - ${response.statusText}`);
				}
				const v = [...partes, response.data];
				dispatch({ type: "SET_FIELD", field: field, value: v });
			}
			await fetch();
		} catch (error) {
			dispatch({ type: "SET_ERRORS", errors: [error.message] });
		}
	}

	const onAcceptSearchParte = (e, parte) => {
		e.preventDefault();
		const partes = state.searchPartes.esReclamante ? state.reclamantes : state.reclamados;
		if (!partes.find(r => r.id === parte.id)) {
			const f = state.searchPartes.esReclamante ? "reclamantes" : "reclamados";
			getParte(parte.id, f, partes);
		}
		dispatch({ type: "SEARCH_PARTES", show: false});
	}

	const getDomicilio = (p) => {
		let s = NO_ESPECIFICADO
		if (p?.domicilio !== "")
			s = p?.domicilio;
		if (p?.localidad !== "")
			s += ", " + p?.localidad

		return s;
	}

	const habilitarWhatsapp = (e) => {
		const input = e.target.parentNode.nextSibling;
		if (e.target.checked) {
			input.disabled = "";
			input.style.backgroundColor = "#fff";
			input.focus();
			input.hidden = false;
			input.display = "inline";
		} else {
			input.hidden = "hidden";
			input.display = "none";
			input.disabled = "disabled";
			input.style.backgroundColor = "#aaa";
			input.value = "";
		}
	}

	const setFieldParte = (field, nro, parteId, esPatrocinante, esReclamante) => {
		const partes = esReclamante ? state.reclamantes : state.reclamados;
		const f = esReclamante ? "reclamantes" : "reclamados";
		const v = partes.map(p => {
			if (p.id === parteId) {
				switch (field) {
					case "nroWhatsapp":
						if (esPatrocinante) {
							return { ...p, nroWhatsappPatrocinante: nro };
						} else {
							return { ...p, nroWhatsappParte: nro };
						}
					case "postergo":
						return { ...p, postergo: !p.postergo };
					case "incomparendo":
						return { ...p, incomparendo: !p.incomparendo };
					case "multado":
						return { ...p, multado: !p.multado };
					default:
						return p;
				}
			}
			return p;
		});
		dispatch({ type: "SET_FIELD", field: f, value: v });
	}

	const inputNroWhatsapp = (parte, esPatrocinante, esReclamante) => {
		const nroWhatsapp = esPatrocinante ? parte.nroWhatsappPatrocinante : parte.nroWhatsappParte;
		const hasValue = nroWhatsapp && nroWhatsapp.trim() !== "";
		const disabled = hasValue? "" : "disabled";
		const style = hasValue? { backgroundColor: "#fff" } : { backgroundColor: "#aaa" };
		return (
			<div className={(esPatrocinante ? "col-6" : "col-5") + " d-flex align-items-center gap-2 mb-1"}>
				<label className="me-2">
						<input 	type="checkbox" 
										defaultChecked={hasValue}
										onChange={(e) => habilitarWhatsapp(e)} 
						/> &nbsp;{esPatrocinante ? "Patrocinio " : "Comparecencia "} Online
				</label>
				<input 	type="number" 
								className="form-control-inline form-control-sm border-0" 
								disabled={disabled}
								placeholder={"Whatsapp " + (esPatrocinante ? "Patrocinante" : "Parte") }
								style={style}
								display={hasValue? "inline" : "none"}
								hidden={!hasValue}
								value={nroWhatsapp || undefined}
								onChange={e => setFieldParte("nroWhatsapp", e.target.value, parte.id, esPatrocinante, esReclamante)} />
			</div>
		)
	}

	const partesTable = (esReclamante) => {
		const partes = esReclamante ? state.reclamantes : state.reclamados;
		const title = esReclamante ? "Reclamantes" : "Reclamados";
		return (
				<div className="mb-3">
					<div className="border-1 border-bottom border-secondary text-primary mb-1 h6 d-flex">
						<div className="pt-2">
							<span className="pe-2">{title}</span>							
							<span>|</span>
							<span className="p-2 rounded text-secondary" id="agregar-parte" onClick={() => addParte(esReclamante)}>
								{PLUSCIRCLE(12, 12)} Añadir
							</span>
						</div>
					</div>
					<table className="w-100">
						<tbody>
							{partes.map((p) => (
								<tr key={p.id}>
									<td id={p.id} key={p.id}>
										<div className="bg-secondary-subtle mb-1 border border-secondary mx-0 rounded-1 px-2">
											<div className='row'>
												<div className="col-4">
													<span className="me-1 fw-bold">Parte:</span>{p.cuil === "0"? p.nroDocumento : p.cuil} - {p.nombre}
												</div>
												<div className="col">
													<span className="me-1 fw-bold">Domicilio:</span> {p.domicilio}
												</div>
												<div className="col d-flex align-items-start mt-1 gap-2" style={{ fontSize: "0.75em" }}>
													<label className="me-2">
															<input type="checkbox" defaultChecked={p.postergo} 
																onChange={e => setFieldParte("postergo", e.target.value, p.id, null, esReclamante) } /> Pidió postergación
													</label>
													<label className="me-2">
															<input type="checkbox" defaultChecked={p.incomparendo} 
																onChange={e => setFieldParte("incomparendo", e.target.value, p.id, null, esReclamante) } /> Incomparendo
													</label>
													<label className="me-2">
															<input type="checkbox" defaultChecked={p.multado} 
																onChange={e => setFieldParte("multado", e.target.value, p.id, null, esReclamante) } /> Aplicar multa
													</label>
												</div>
											</div>
											<div>
												<span className="text-secondary d-flex border-bottom border-secondary-subtle">Patrocinante</span>
													{(p.patrocinante == null) ? (
													<div className="row py-1">
														<div className="col-11 text-center">
															<span className="border rounded border-warning bg-warning-subtle m-auto p-1" 
																style={{"fontSize": "0.75em"}}>No hay datos para mostrar.</span>
														</div>
														<div className="col-1 d-flex justify-content-end align-items-end">
															<button className="btn btn-sm btn-outline-danger" title="Eliminar"
																onClick={() => removeParte(p.id, esReclamante)}>
																	{DELETE}
															</button>
														</div>
													</div>
													):(
													<>
														<div className="row">
															<div className="col-2">
																<span className="fw-bold">Nº Matr.: </span> {p.patrocinante?.nroMatricula}
															</div>
															<div className="col-4">
																<span className="fw-bold">Nombre: </span>{p.patrocinante?.nombre}
															</div>
															<div className="col-6">
																<span className="fw-bold">Domicilio: </span> 
																{getDomicilio(p.patrocinante)}
															</div>
														</div>
														<div className="row pt-2">
															{inputNroWhatsapp(p, false, esReclamante)}
															{inputNroWhatsapp(p, true, esReclamante)}
															<div className="col-1 d-flex justify-content-end align-items-end">
																<button className="btn btn-sm btn-outline-danger mb-1" title="Eliminar Parte"
																	onClick={() => removeParte(p.id, esReclamante)}>
																		{DELETE}
																</button>
															</div>
														</div>
													</>
													)}
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
		);
	}

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
			{state.searchPartes.show && (
				<SearchParteDialog title={state.searchPartes.esReclamante?"Agregar reclamante":"Agregar reclamado"} handleAccept={onAcceptSearchParte} 
					handleCancel={() => dispatch({ type: "SEARCH_PARTES", show: false })} />
				) }

		  <h3 className="mb-3">{isNaN(id)? "Nuevo " : "Edición de "} Reclamo</h3>
			{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
			<div className="row mb-3">
				<div className="col-4">
					<label htmlFor="numero" className="form-label">Número</label>
					<input id="numero" placeholder="Número" className="form-control text-end w-auto" type="number" value={state.numero} 
						onChange={setField} required />
				</div>
				<div className="col">
					<label htmlFor="fechaHoraInicio" className="form-label d-block">Fecha y Hora</label>
					<input id="fechaHoraInicio" placeholder="AAAA-MM-DD HH:MM" className="form-control text-center d-inline-block w-auto" 
						type="datetime-local" value={state.fechaHoraInicio} onChange={setField} />
					<span className="mx-3">hasta</span>
					<input id="horaFin" placeholder="HH:MM" className="form-control d-inline text-center w-auto" type="time" value={state.horaFin} 
						onChange={setField} />
				</div>
			</div>

			<div className="row mb-3">
				<div className="col-4">
					<label htmlFor="idResolucion" className="form-label">Resolución</label>
					<DataBindedSelect data={RESOLUCIONES} selectedValue={state.idResolucion} 
						setSelectedValue={(v) => dispatch({ type: "SET_FIELD", field: "idResolucion", value: parseInt(v) })} />
				</div>

				<div className="col">
					{(state.idResolucion === POSTERGADO) && (
					<>
					<label htmlFor="proxAudiencia" className="form-label d-block">Próxima audiencia:</label>
					<input id="proxAudiencia" placeholder="AAAA-MM-DD HH:MM" className="form-control text-center d-inline-block w-auto" 
						type="datetime-local" value={state.proxAudiencia} onChange={setField} />
					</>)}
				</div>
			</div>

			<div className="mb-3">
				<label htmlFor="rubros" className="form-label">Rubros</label>
				<textarea className="form-control" id="rubros" rows="5" placeholder="Objetos del reclamo/rubros y períodos..."
					value={state.rubros} onChange={setField}>
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
					<button disabled={state.loading || state.searchPartes.show } type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
					<Link to="/reclamos" className="btn btn-outline-primary">Cancelar</Link>
			</div>
    
    </form>

  );
}
