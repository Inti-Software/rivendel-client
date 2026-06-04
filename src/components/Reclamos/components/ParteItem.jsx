import { DELETE } from "../../Shared/Icons";
import NroWhatsappInput from "./NroWhatsappInput";
import { getDomicilio, removeParte, setFieldParte } from "../partes.utils";

const ParteItem = ({p, esReclamante, state, setField}) => (
	<tr key={p.id}>
		<td id={p.id} key={p.id}>
			<div className="bg-secondary-subtle mb-1 border border-secondary mx-0 rounded-1 px-2">
				<div className='row'>
					<div className="col-4">
						<span className="me-1 fw-bold">Parte:</span>{!p.cuil? p.nroDocumento : p.cuil} - {p.nombre}
					</div>
					<div className="col">
						<span className="me-1 fw-bold">Domicilio:</span> {p.domicilio}
					</div>
					<div className="col d-flex align-items-start mt-1 gap-2" style={{ fontSize: "0.75em" }}>
						<label className="me-2">
								<input type="checkbox" defaultChecked={p.postergo} 
									onChange={e => setFieldParte("postergo", e.target.value, p.id, null, esReclamante, state, setField) } /> Pidió postergación
						</label>
						<label className="me-2">
								<input type="checkbox" defaultChecked={p.incomparendo} 
									onChange={e => setFieldParte("incomparendo", e.target.value, p.id, null, esReclamante, state, setField) } /> Incomparendo
						</label>
						<label className="me-2">
								<input type="checkbox" defaultChecked={p.multado} 
									onChange={e => setFieldParte("multado", e.target.value, p.id, null, esReclamante, state, setField) } /> Aplicar multa
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
									onClick={() => removeParte(p.id, esReclamante, state, setField)}>
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
								<NroWhatsappInput parte={p} esPatrocinante={false} esReclamante={esReclamante} 
									onChange={(value, id) => setFieldParte("nroWhatsapp", value, id, false, esReclamante, state, setField)} />
								<NroWhatsappInput parte={p} esPatrocinante={true} esReclamante={esReclamante} 
									onChange={(value, id) => setFieldParte("nroWhatsapp", value, id, true, esReclamante, state, setField)} />
								<div className="col-1 d-flex justify-content-end align-items-end">
									<button className="btn btn-sm btn-outline-danger mb-1" title="Eliminar Parte"
										onClick={() => removeParte(p.id, esReclamante, state, setField)}>
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
);

export default ParteItem;