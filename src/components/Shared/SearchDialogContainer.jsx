import { useEffect, useRef } from 'react';
import { SEARCH } from './Icons';
import useSearchDialog from '../../hooks/useSearchDialog';

const SearchDialogContainer = ({
	title,
	placeholder,
	columns,          // [{ key: 'nombre', label: 'Nombre' }, ...]
	searchFn,         // (term: string) => Promise<Response>
	onAccept,
	onCancel,
	minTermLength = 3,
	emptyMessage = "No hay datos para mostrar."
}) => {
	const {
		term, data, selected, selectedId, done, error, loading,
		setTerm, selectRow, buscarAhora
	} = useSearchDialog(searchFn, { minTermLength });

	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleKeyDown = (event) => {
		if (event.key === "Enter") buscarAhora();
		if (event.key === "Escape") onCancel(event);
	};

	const feedbackClassName = error
		? "bg-danger-subtle border-danger"
		: "bg-warning-subtle border-warning";

	return (
		<div className="modal show modal-backdrop-50 dialog-centered d-flex" tabIndex="-1"
			onKeyDown={handleKeyDown}>
			<div className="modal-dialog center-vertical min-vw-100">
				<div className="modal-content w-50">
					<div className="modal-header bg-success text-white">
						<h5 className="modal-title">{title}</h5>
					</div>
					<div className="modal-body">
						<div className="row mb-3">
							<div className="col-11">
								<input
									ref={inputRef}
									type="text"
									className="form-control"
									placeholder={placeholder}
									autoComplete="off"
									value={term}
									onChange={(e) => setTerm(e.target.value)}
								/>
							</div>
							<div className="col-1">
								<button type="button" className="btn btn-outline-primary" onClick={buscarAhora}>
									{SEARCH}
								</button>
							</div>
						</div>

						<div style={{ maxHeight: "200px", overflowY: "scroll" }} className="d-flex">
							{data.length > 0 ? (
								<table className="table table-striped table-sm mx-1 table-hover">
									<thead>
										<tr>
											{columns.map(col => <th key={col.key} scope="col">{col.label}</th>)}
										</tr>
									</thead>
									<tbody>
										{data.map((row) => {
											const isSelected = row.id === selectedId;
											return (
												<tr key={row.id} onClick={() => selectRow(row.id)} style={{ cursor: "pointer" }}>
													{columns.map(col => (
														<td key={col.key} className={isSelected ? "bg-warning-subtle" : ""}>
															{row[col.key]}
														</td>
													))}
												</tr>
											);
										})}
									</tbody>
								</table>
							) : (
								done && (
									<span
										className={"rounded-2 border text-center text-black w-auto mx-auto border-1 p-1 " + feedbackClassName}
										style={{ fontSize: "12px" }}
									>
										{error || emptyMessage}
									</span>
								)
							)}
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-success"
							onClick={(e) => onAccept(e, selected)}
							disabled={!selected || loading}
						>
							Aceptar
						</button>
						<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
							Cancelar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchDialogContainer;