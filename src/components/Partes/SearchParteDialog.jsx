import { useEffect, useRef, useState } from 'react';
import { Partes } from '../../utils/endpoints';
import { SEARCH } from '../../utils/Icons';
import { NO_ESPECIFICADO } from '../../utils/constants';

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
			//const cuil = row.cells[1].innerText;
			//const nombre = row.cells[2].innerText;
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
		
  const getDomicilio = (p) => {
    let s = NO_ESPECIFICADO
    if (p?.domicilio !== "")
      s = p?.domicilio;
    if (p?.localidad !== "")
      s += ", " + p?.localidad

    return s;
  }

	return (
		<div className={`modal show modal-backdrop-50 dialog-centered`} 
				style={{display: 'flex'}}
				tabIndex="-1"
				>
			<div className="modal-dialog center-vertical min-vw-100">
				<div className="modal-content w-50">
					<div className="modal-header bg-success text-white">
						<h5 className="modal-title">Partes</h5>
					</div>
					<div className="modal-body">
						<div className="row mb-3">
							<div className="col-11">
								<input id='criterio' type="text" className="form-control" placeholder="Nombre o CUIL " value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
									onKeyDown={handleKeyDown} />
							</div>
							<div className="col-1">
								<button type="button" className="btn btn-outline-primary form-control" onClick={buscar}>
									{SEARCH}
								</button>
							</div>
						</div>
						<div style={{ maxHeight: "400px", overflowY: "scroll" }} onClick={onSelectRow} className='d-flex'>
							{data.data?.length > 0 ? (
								<table className="table table-sm table-hover">
									<tbody>
									{ data.data?.map((p) => (
										<tr>
											<td key={p.id} className='pt-2 pb-2 border-bottom border-secondary rounded-1'>
												<div className='row bg-secondary-subtle border border-secondary mx-0 rounded-1'>
													<div className='col-3'>
														<span className="fw-bold">CUIL: </span>{p.cuil === 0? p.nroDocumento : p.cuil} 
													</div>
													<div className='col-9'>
														<span className="fw-bold">Nombre: </span>{p.nombre}
													</div>
												</div>
												<div>
													<span className="text-info-emphasis d-flex border-bottom border-success-subtle">Patrocinante</span>
													<div className="row">
														{(p.patrocinante == null) ? (
														<div className="col">
															<span className="d-inline-block border rounded border-warning p-1" style={{"fontSize": "0.75em"}}>- Sin patrocinante -</span>
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
											</td>
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