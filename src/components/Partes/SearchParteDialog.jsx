import React, { useEffect, useRef, useState } from 'react';
import { Partes } from '../../utils/endpoints';

const SearchParteDialog = ({ handleAccept, handleCancel }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [data, setData] = useState([]);
	const message = useRef(null);
	const selected = useRef({id: 0, cuil: "", nombre: ""});

	const buscar = (e) => {
		e.preventDefault();
		if (!searchTerm || searchTerm.trim() === "") {
			alert("Ingrese un término de búsqueda válido.");
			return;
		}

		const q = searchTerm.trim()

		Partes
			.search({q, currentPage: 1, recordsPerPage: 10 })
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				setData(data)
				if (data.totalRecords === 0) {
					message.current = "No se encontraron datos.";
				}
			})
			.catch(error => {
				console.error("Error al buscar partes:", error);
				message.current = "Ocurrió un error al realizar la búsqueda. Por favor, inténtelo de nuevo.";
			});
	}

	const onSelectRow = (event) => {
		const row = event.target.closest("tr");
		if (row) {
			const selectedId = row.cells[0].id;
			const cuil = row.cells[1].innerText;
			const nombre = row.cells[2].innerText;
			row.parentNode.querySelectorAll("td").forEach(td => {
				td.className = ""
			});
			row.querySelectorAll("td").forEach(td => {
				td.className = "bg-warning-subtle"
			});
			selected.current = {id: selectedId, cuil, nombre};
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
		
	return (
		<div className={`modal show modal-backdrop-50 dialog-centered`} 
				style={{display: 'flex'}}
				tabIndex="-1"
				>
			<div className="modal-dialog center-vertical w-50">
				<div className="modal-content">
					<div className="modal-header bg-success text-white">
						<h5 className="modal-title">Partes</h5>
					</div>
					<div className="modal-body">
						<div className="row mb-3">
							<div className="col-10">
								<input id='criterio' type="text" className="form-control text-end" placeholder="Nombre o CUIL " value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
									onKeyDown={handleKeyDown} />
							</div>
							<div className="col-2">
								<input type='button' className="btn btn-outline-primary form-control" value="Buscar" onClick={buscar} />
							</div>
						</div>
						<div className='row mb-3' onClick={onSelectRow}>
							{data.data?.length > 0 ? (
								<table className="table table-striped table-sm mx-1 table-hover">
									<thead>
										<tr>
											<th></th>
											<th scope='col'>CUIL</th>
											<th scope='col'>Nombre</th>
										</tr>
									</thead>
									<tbody>
										{data.data?.map((p) => (
											<tr key={p.id}>
												<td id={p.id}></td>
												<td>{p.cuil}</td>
												<td>{p.nombre}</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								(message.current) &&
								(<span className="rounded-2 border bg-warning-subtle border-warning text-center text-black w-auto mx-auto"
										style={{ fontSize: '12px' }}>
									{message.current}
								</span>)
							)}
						</div>
					</div>
					<div className="modal-footer">
						{data.data?.length > 0 && (
							<button type="button" className="btn btn-success" onClick={(e) => handleAccept(e, selected.current)}>
								Aceptar
							</button>
						)}
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