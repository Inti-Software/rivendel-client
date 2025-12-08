import { useEffect, useReducer } from 'react';
import { Patrocinantes } from '../../utils/endpoints';
import { SEARCH } from '../../utils/Icons';

const initialState = {
	term: "",
	data: [],
	selected: {
		id: 0,
		nombre: "",
		nroMatricula: ""
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
				term: action.term,
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

const SearchPatrocinanteDialog = ({ handleAccept, handleCancel }) => {
	const [state, dispatch] = useReducer(formReducer, initialState);

	const buscar = (e) => {
		e.preventDefault();
		if (state.term.trim() === "") {
			alert("Ingrese un término de búsqueda válido.");
			return;
		}

		dispatch({ type: "SEARCH_START" })
		Patrocinantes
			.search(state.term.trim())
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => { dispatch({ type: "SEARCH_SUCCESS", data: data }) })
			.catch(error => {
				console.error("Error al buscar patrocinantes:", error);
				dispatch({ type: "SEARCH_FAIL", error: "Ocurrió un error al realizar la búsqueda. " + 
					"Por favor, inténtelo de nuevo." })
			});
	}

	const onSelectRow = (event) => {
		const row = event.target.closest("tr");
		if (row) {
			const selectedId = parseInt(row.id);
			const nombre = row.cells[0].innerText;
			const nroMatricula = parseInt(row.cells[1].innerText);
			row.parentNode.querySelectorAll("td").forEach(td => {
				td.className = ""
			});
			row.querySelectorAll("td").forEach(td => { td.className = "bg-warning-subtle"	});
			dispatch({ type: "SET_FIELD", field: "selected", value: {id: selectedId, nombre, nroMatricula} })
		}
	}

	const handleKeyDown = (event) => {
		if (event.keyCode === 13) {
			buscar(event);
		}
	}

	useEffect(() => {
		document.getElementById("criterio").focus();
	}, []);

	const getClassName = () => {
		const warning = "bg-warning-subtle border-warning";
		const error = "bg-danger-subtle border-danger";
		return (state.error.trim() !== "")? error : warning;
	}

	const getMessage = () => {
		const msg = "No hay datos para mostrar."
		return (state.error.trim() !== "")? state.error : msg;
	}
		
	return (
		<div className={`modal show modal-backdrop-50 dialog-centered d-flex`} tabIndex="-1">
			<div className="modal-dialog center-vertical min-vw-100">
				<div className="modal-content w-50">
					<div className="modal-header bg-success text-white">
						<h5 className="modal-title">Patrocinantes</h5>
					</div>
					<div className="modal-body">
						<div className="row mb-3">
							<div className="col-11">
								<input id='criterio' type="text" className="form-control" placeholder="Juan Pérez... " 
									value={state.term} onChange={e => dispatch({ type: "SET_FIELD", field: "term", value: e.target.value })} 
									onKeyDown={handleKeyDown} />
							</div>
							<div className="col-1">
								<button type="button" className="btn btn-outline-primary" onClick={buscar}>
									{SEARCH}
								</button>
							</div>
						</div>
						<div style={{ maxHeight: "200px", overflowY: "scroll" }} onClick={onSelectRow} className='d-flex'>
						{state.data.length > 0 ? (
							<table className="table table-striped table-sm mx-1 table-hover">
								<thead>
									<tr>
										<th scope='col'>Nombre</th>
										<th scope='col'>Matrícula</th>
										<th scope='col'>Casillero</th>
									</tr>
								</thead>
								<tbody>
									{state.data.map((p) => (
										<tr key={p.id} id={p.id}>
											<td>{p.nombre}</td>
											<td>{p.nroMatricula}</td>
											<td>{p.nroCasillero}</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							state.done && 
							(<span className={"rounded-2 border text-center text-black w-auto mx-auto border-2 p-1 " + getClassName()}
								style={{ fontSize: '12px' }}> { getMessage() } </span>
							)
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

export default SearchPatrocinanteDialog;