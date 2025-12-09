import { useEffect, useReducer } from 'react';
import { Partes } from '../../utils/endpoints';
import { SEARCH } from '../../utils/Icons';
import { NO_ESPECIFICADO } from '../../utils/constants';
import useDebounce from '../../hooks/useDebounce';

const initialState = {
	term: "",
	data: [],
	selected: {
		id: 0,
		cuil: "",
		nombre: ""
	},
	done: false,
	error: "",
	loading: false
}

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
				error: ""
      };

    case "SEARCH_START":
      return { 
				...state, 
				error: "",
				loading: true 
			};

    case "SEARCH_SUCCESS": 
      return {
				...initialState, 
				term: state.term,
				data: action.data,
				done: true
			};

    case "SEARCH_FAIL": {
      return { 
				...state,
				error: action.error,
				loading: false,
				done: true
			};
		}

    default:
      return state;
  }
}

const SearchParteDialog = ({ title, handleAccept, handleCancel }) => {
	const [state, dispatch] = useReducer(formReducer, initialState);
	const debouncedValue = useDebounce(state.term, 300)

	const buscar = () => {
		if (debouncedValue.trim().length < 3) {			
			return;
		}

		Partes
			.search({ q: debouncedValue.trim(), currentPage: 1, recordsPerPage: 100 })
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => { dispatch({ type: "SEARCH_SUCCESS", data: data.data }) })
			.catch(error => {
				console.error("Error al buscar partes:", error);
				dispatch({ type: "SEARCH_FAIL", error: "Ocurrió un error al realizar la búsqueda. Por favor, inténtelo de nuevo." })
			});
	}

	useEffect(() => {
		state.term ? buscar() : dispatch({ type: "SET_FIELD", field: "term", value: "" })
	}, [debouncedValue])

	const onSelectRow = (event) => {
		const row = event.target.closest("tr");
		const td = row.querySelector("td");
		dispatch({ type: "SET_FIELD", field: "selected", value: { id: parseInt(td.id) } });
	}

	const handleKeyDown = (event) => {
		if (event.keyCode === 13) {
			buscar();
		}
		if (event.keyCode === 27) {
			handleCancel(event)
		}
	}

	useEffect(() => {
		document.getElementById("criterio").focus();
	}, []);
		
  const getDomicilio = (p) => {
    let s = NO_ESPECIFICADO
    if (p?.domicilio !== "")
      s = p?.domicilio;
    if (p?.localidad !== "")
      s += ", " + p?.localidad

    return s;
  }

	const getClassName = () => {
		const warning = "bg-warning-subtle border-warning";
		const error = "bg-danger-subtle border-danger";
		return (state.error.trim() !== "")? error : warning;
	}

	const getMessage = () => {
		const msg = "No hay datos para mostrar."
		return (state.error.trim() !== "")? state.error : msg;
	}

	const handleChange = (e) => {
		dispatch({ type: "SET_FIELD", field: "term", value: e.target.value })
		dispatch({ type: "SET_FIELD", field: "done", value: false })
		dispatch({ type: "SET_FIELD", field: "data", value: [] })
	}

	return (
		<div className={`modal show modal-backdrop-50 dialog-centered`} 
				style={{display: 'flex'}}
				tabIndex="-1"
				>
			<div className="modal-dialog center-vertical min-vw-100">
				<div className="modal-content w-50">
					<div className="modal-header bg-success text-white">
						<h5 className="modal-title">{title}</h5>
					</div>
					<div className="modal-body">
						<div className="row mb-3">
							<div className="col-11">
								<input id='criterio' type="text" className="form-control" placeholder="Nombre o CUIL" autoComplete='off'
									value={state.term} onChange={ handleChange } onKeyDown={handleKeyDown} />
							</div>
							<div className="col-1">
								<button type="button" className="btn btn-outline-primary form-control" onClick={buscar}>
									{SEARCH}
								</button>
							</div>
						</div>
						<div style={{ maxHeight: "400px", overflowY: "scroll" }} onClick={onSelectRow} className='d-flex'>
							{state.data?.length > 0 ? (
								<table className="w-100">
									<tbody>
									{ state.data?.map((p) => (
										<tr key={p.id}>
											<td id={p.id}>
												<div className={'border border-secondary mx-0 rounded-1 p-2 mb-1 ' + ((p.id === state.selected.id)? 'bg-warning-subtle' : 'bg-secondary-subtle') }>
													<div className='row'>
														<div className='col-3'>
															<span className="fw-bold">CUIL: </span>
															<span aria-label='cuil'>{p.cuil === "0"? p.nroDocumento : p.cuil}</span>
														</div>
														<div className='col-9'>
															<span className="fw-bold">Nombre: </span>
															<span aria-label='nombre'>{p.nombre}</span>
														</div>
													</div>
													<div>
														<span className="text-secondary d-flex border-bottom border-secondary-subtle">Patrocinante</span>
														<div className="row">
															{(p.patrocinante == null) ? (
															<div className="col-12 d-flex p-2">
																<span className="border rounded border-warning bg-warning-subtle m-auto p-1" 
																	style={{"fontSize": "0.75em"}}>No hay datos para mostrar.</span>
															</div>
															):(
															<>
																<div className="col-2">
																	<span className="fw-bold">Nº Matr.: </span> {p.patrocinante?.nroMatricula}
																</div>
																<div className="col-4">
																	<span className="fw-bold">Nombre: </span>{p.patrocinante?.nombre}
																</div>
																<div className="col-6">
																	<span className="fw-bold">Domicilio: </span>{getDomicilio(p.patrocinante)}
																</div>
															</>
															)}
														</div>
													</div>
												</div>
											</td>
										</tr> 
									))}
									</tbody>
								</table>
							) : (
								state.done &&
								(<span className={"rounded-2 border text-center text-black mx-auto border-2 p-1 " + getClassName() }
										style={{ fontSize: '12px' }}>
									{ getMessage() }
								</span>)
							)}
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-success" onClick={(e) => handleAccept(e, state.selected)}
							disabled={(state.data.length > 0 && !state.loading)? "" : "disabled"}>
							Aceptar
						</button>
						<button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
							Cancelar
						</button>
					</div>
				</div>
			</div>
		</div>
	)
};

	export default SearchParteDialog;