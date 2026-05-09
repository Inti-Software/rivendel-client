import { PLUSCIRCLE, DELETE } from "../../../Shared/Icons";
import { NO_ESPECIFICADO } from "../../../Shared/constants";
import NroWhatsappInput from "./NroWhatsappInput";

const removeParte = (id, setField, state, isReclamante) => {
	const partes = isReclamante ? state.reclamantes : state.reclamados;
	const f = isReclamante ? "reclamantes" : "reclamados";
	const v = partes.filter(p => p.id !== id);
	setField(f, v)
}

const getDomicilio = (p) => {
	let s = NO_ESPECIFICADO
	if (p?.domicilio !== "")
		s = p?.domicilio;
	if (p?.localidad !== "")
		s += ", " + p?.localidad

	return s;
}

const setFieldParte = (state, field, nro, parteId, esPatrocinante, esReclamante, setField) => {
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
	setField(f, v);
}

const onChangeNroWhatsapp = (e, id, esPatrocinante, esReclamante, setField) => 
	setFieldParte("nroWhatsapp", e.target.value, id, esPatrocinante, esReclamante, setField);

const PartesTable = ({ state, esReclamante, setField, onAddParte }) => {
	const partes = esReclamante ? state.reclamantes : state.reclamados;
	const title = esReclamante ? "Reclamantes" : "Reclamados";
	return (
			<div className="mb-3">
				<div className="border-1 border-bottom border-secondary text-primary mb-1 h6 d-flex">
					<div className="pt-2">
						<span className="pe-2">{title}</span>							
						<span>|</span>
						<span className="p-2 rounded text-secondary" id="agregar-parte" onClick={onAddParte}>
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
															onChange={e => setFieldParte("postergo", e.target.value, p.id, null, esReclamante, setField) } /> Pidió postergación
												</label>
												<label className="me-2">
														<input type="checkbox" defaultChecked={p.incomparendo} 
															onChange={e => setFieldParte("incomparendo", e.target.value, p.id, null, esReclamante, setField) } /> Incomparendo
												</label>
												<label className="me-2">
														<input type="checkbox" defaultChecked={p.multado} 
															onChange={e => setFieldParte("multado", e.target.value, p.id, null, esReclamante, setField) } /> Aplicar multa
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
															onClick={() => removeParte(p.id, setField, state, esReclamante)}>
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
														<NroWhatsappInput parte={p} esPatrocinante={false} esReclamante={esReclamante} onChange={onChangeNroWhatsapp} />
														<NroWhatsappInput parte={p} esPatrocinante={true} esReclamante={esReclamante} onChange={onChangeNroWhatsapp} />
														<div className="col-1 d-flex justify-content-end align-items-end">
															<button className="btn btn-sm btn-outline-danger mb-1" title="Eliminar Parte"
																onClick={() => removeParte(p.id, setField, state, esReclamante)}>
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

export default PartesTable;