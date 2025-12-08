import React, { useEffect, useRef, useState } from 'react';
import { Patrocinantes } from '../../utils/endpoints';
import { SEARCH } from '../../utils/Icons';

const SearchPatrocinanteDialog = ({ handleAccept, handleCancel }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [data, setData] = useState([]);
	const message = useRef(null);
	const selected = useRef({id: 0, nombre: "", nroMatricula: ""});

	const buscar = (e) => {
		e.preventDefault();
		if (!searchTerm || searchTerm.trim() === "") {
			alert("Ingrese un término de búsqueda válido.");
			return;
		}

		Patrocinantes
			.search(searchTerm)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				setData(data)
				if (data.length === 0) {
					message.current = "No se encontraron datos.";
				}
			})
			.catch(error => {
				console.error("Error al buscar patrocinantes:", error);
				message.current = "Ocurrió un error al realizar la búsqueda. Por favor, inténtelo de nuevo.";
			});
	}

	const onSelectRow = (event) => {
		const row = event.target.closest("tr");
		if (row) {
			const selectedId = parseInt(row.cells[0].id);
			const nombre = row.cells[1].innerText;
			const nroMatricula = parseInt(row.cells[2].innerText);
			row.parentNode.querySelectorAll("td").forEach(td => {
				td.className = ""
			});
			row.querySelectorAll("td").forEach(td => {
				td.className = "bg-warning-subtle"
			});
			selected.current = {id: selectedId, nombre, nroMatricula};
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
									value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
							</div>
							<div className="col-1">
								<button type="button" className="btn btn-outline-primary" onClick={buscar}>
									{SEARCH}
								</button>
							</div>
						</div>
						<div style={{ maxHeight: "200px", overflowY: "scroll" }} onClick={onSelectRow} className='d-flex'>
						{data.length > 0 ? (
								<table className="table table-striped table-sm mx-1 table-hover">
									<thead>
										<tr>
											<th scope='col'>Nombre</th>
											<th scope='col'>Matrícula</th>
											<th scope='col'>Casillero</th>
										</tr>
									</thead>
									<tbody>
										{data.map((p) => (
											<tr key={p.id}>
												<td>{p.nombre}</td>
												<td>{p.nroMatricula}</td>
												<td>{p.nroCasillero}</td>
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
						{data.length > 0 && (
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

	export default SearchPatrocinanteDialog;