import React, { useRef, useState } from 'react';
import { Patrocinantes } from '../../utils/endpoints';

const SearchPatrocinanteDialog = ({ handleAccept, handleCancel }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [data, setData] = useState([]);
	const selected = useRef({id: 0, nombre: "", nroMatricula: ""});

	const buscar = () => {
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
			.then(data => setData(data))
			.catch(error => {
				console.error("Error al buscar patrocinantes:", error);
				alert("Ocurrió un error al realizar la búsqueda. Por favor, inténtelo de nuevo.");
			});
	}

	const onSelectRow = (event) => {
		const row = event.target.closest("tr");
		if (row) {
			const selectedId = row.cells[0].id;
			const nombre = row.cells[1].innerText;
			const nroMatricula = row.cells[2].innerText;
			row.parentNode.querySelectorAll("td").forEach(td => {
				td.className = ""
			});
			row.querySelectorAll("td").forEach(td => {
				td.className = "bg-warning-subtle"
			});
			selected.current = {id: selectedId, nombre, nroMatricula};
		}
	}
		
	return (
		<div className={`modal show modal-backdrop-50 dialog-centered`} 
				style={{display: 'flex'}}
				tabIndex="-1"
				>
			<div className="modal-dialog center-vertical">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Patrocinantes</h5>
					</div>
					<div className="modal-body">
						<div className="row mb-3">
							<div className="col-10">
								<input type="text" className="form-control" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value) } />
							</div>
							<div className="col">
								<input type="button" onClick={buscar} value="Buscar" className="btn btn-primary ms-2" />
							</div>
						</div>
						<div className='row mb-3' onClick={onSelectRow}>
							{data.length > 0 ? (
								<table className="table table-striped table-sm mx-1 table-hover">
									<thead>
										<tr>
											<th></th>
											<th scope='col'>Nombre</th>
											<th scope='col'>Matrícula</th>
										</tr>
									</thead>
									<tbody>
										{data.map((p) => (
											<tr key={p.id}>
												<td id={p.id}></td>
												<td>{p.nombre}</td>
												<td>{p.nroMatricula}</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p>No se encontraron patrocinantes.</p>
							)}
						</div>
					</div>
					<div className="modal-footer">
						{data.length > 0 && (
							<button type="button" className="btn btn-success" onClick={() => handleAccept(selected.current)}>
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