import { NO_ESPECIFICADO } from "../../Shared/constants";
import DeleteMessage from "../../Shared/DeleteMessage.jsx"
import { GridEditButton, GridDeleteButton } from "../../Grid/GridButtons.jsx";

const getDomicilio = (p) => {
	let s = NO_ESPECIFICADO
	if (p.domicilio && p?.domicilio !== "")
		s = p?.domicilio;
	if (p?.localidad && p?.localidad !== "")
		s += ", " + p?.localidad

	return s;
}

const getIdentificacion = (p) => {
	const nroDocumento = (Number(p.cuil) === 0)? p.nroDocumento : p.cuil; 
	if (nroDocumento === "0") {
		return p.nombre
	}
	return nroDocumento + " - " + p.nombre
}

const getDeleteMessage = (p) => 
	(<DeleteMessage message={"¿Está seguro que desea eliminar esta parte?"}
			fields={getIdentificacion(p)} />)

export default function ListCell(p, onDeleteRecord) {
	return (
		<>
			<div className="row bg-primary-subtle rounded-2 d-flex align-items-center">
				<div className="col-10">
					{p.nombre}
				</div>
				<div className="col d-flex justify-content-end">
					<GridEditButton path={`/partes/edit/${p.id}`} 
						style={{ "--bs-btn-font-size": ".75rem" }}
						className={"btn btn-outline-secondary my-1"}
					/>

					<GridDeleteButton
						path={`/partes/delete/${p.id}`}
						onDelete={(e) => onDeleteRecord(e, p.id, getDeleteMessage(p))}
						style={{ "--bs-btn-font-size": ".75rem" }}
						className="my-1"
						/>
				</div>
			</div>
			<div className="row mb-2 h6 pt-2">
				<div className="col-3">
					<span className="fw-bold">Documento: </span>
					<span>{p.tipoDocumento} {p.nroDocumento}</span>
				</div>
				<div className="col-2">
					<span className="fw-bold">Cuil: </span>
					<span>{(p.cuil === "null")? "": p.cuil}</span>
				</div>
				<div className="col-4">
					<span className="fw-bold">Domicilio: </span>
					<span>{p.domicilio}</span>
				</div>
				<div className="col-3">
					<span className="fw-bold">Localidad: </span>
					<span>{p.localidad}</span>
				</div>
			</div>
			<h6 className="d-flex w-100 border-bottom border-primary-subtle mt-3">
					<span className="text-info-emphasis">
						Patrocinante 
					</span>
					<span className="badge text-bg-secondary ms-2 mb-1" style={{ fontSize: "0.5em" }}>
						{p.esApoderado? "Apoderado": ""}
					</span>
			</h6>
			<div className="row mb-2">
				{(p.patrocinante == null) ? (
				<div className="col">
					<span className="d-flex justify-content-center m-auto bg-warning-subtle border rounded border-warning" 
						style={{"fontSize": "0.75em", width: "125px"}}>
							- Sin patrocinante -
					</span>
				</div>
				):(
				<>
					<div className="col-2">
						<span className="fw-bold">Nº Matrícula: </span> {p.patrocinante?.nroMatricula}
					</div>
					<div className="col-4">
						<span className="fw-bold">Nombre: </span>{p.patrocinante?.nombre}
					</div>
					<div className="col">
						<span className="fw-bold">Domicilio: </span>{getDomicilio(p.patrocinante)}
					</div>
				</>
				)}
			</div>
		</>
	)
}