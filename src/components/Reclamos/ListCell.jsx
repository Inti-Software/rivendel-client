import dayjs from "dayjs";
import { RECLAMANTE, RECLAMADO } from "../Shared/constants";
import DeleteMessage from "../Shared/DeleteMessage.jsx"
import { GridEditButton, GridDeleteButton, GridPrintButton } from "../Grid/GridButtons.jsx";
import createPDF from "./pdfBuilders.js";
import { CON_ARREGLO, INCOMPARECENCIA_EMPLEADOR, INCOMPARECENCIA_RECLAMANTE, PENDIENTE, SIN_ARREGLO } from "../Resoluciones/tiposResoluciones";

const getDeleteMessage = (rec) => {
	const s = `¿Está seguro que desea eliminar el reclamo Nº ${rec.numero}?`;
	return (<DeleteMessage message={s} />)
}

const handlePrint = (e, id) => {
	e.preventDefault();
	createPDF(id);
};

const getBadgeColor = (resolucionId) => {
	switch (resolucionId) {
		case SIN_ARREGLO:
			return "badge bg-warning text-dark fs-very-small";
		case CON_ARREGLO:
			return "badge bg-success fs-very-small";
		case INCOMPARECENCIA_EMPLEADOR:
			return "badge bg-primary fs-very-small";
		case INCOMPARECENCIA_RECLAMANTE:
			return "badge bg-info text-dark fs-very-small";		
		default:
			return "badge bg-secondary fs-very-small";
	}
}

export default function ListCell(rec, onDeleteRecord) {
	return (
		<>
			<div className="row bg-secondary-subtle rounded-1">
				<div className="col m-1">
					<div className="row">
						<div className="col-11">
							<div className="row">
								<div className="col-2 d-flex align-items-center text-success">
									<h3 className="fw-bold">Nº {rec.numero}</h3>
								</div>
								<div className="col-6 d-flex align-items-center small">
									<span>{dayjs(rec.fechaHoraInicio).format("DD [de] MMMM [de] YYYY - HH:mm [hs]")}</span>
									{(dayjs(rec.horaFin).isValid()) && (
									<>
										<span className="ms-1 me-1">hasta</span>
										<span>{dayjs(rec.horaFin).format("HH:mm [hs]")}</span>
									</>)}
								</div>
								<div className="col-4 d-flex align-items-center justify-content-end">
									{rec.proximaAudiencia && (
										<span className="badge bg-dark-subtle text-primary-emphasis fs-very-small me-2 fw-lighter">
											Próxima audiencia: {dayjs(rec.resolucion.proximaAudiencia).format("DD/MM/YYYY HH:mm")}
										</span>
									)}
									<span className={getBadgeColor(rec.resolucion.id)}>{rec.resolucion.descripcion}</span>
								</div>
							</div>
							<div className="row">
								<div className="col-6 border border-secondary-subtle rounded p-2">
									<h6>Reclamantes</h6>
									<span>
										{rec.partes.filter(p => p.rol === RECLAMANTE).map((r) => r.parte.nombre).join(", ")}
									</span>
								</div>
								<div className="col-6 border border-secondary-subtle rounded p-2">
									<h6>Reclamados</h6>
									<span>
										{rec.partes.filter(p => p.rol === RECLAMADO).map((r) => r.parte.nombre).join(", ")}
									</span>
								</div>
							</div>
						</div>
						<div className="col-1 d-flex align-items-center">
							<div className="row">
								<div className="col mb-1">
									<GridEditButton path={`/reclamos/edit/${rec.id}`} className={"w-100"} />
								</div>
								{(rec.resolucion.id !== PENDIENTE) && (
								<div className="col mb-1">
									<GridPrintButton path={`/reclamos/acta/${rec.id}`} className={"w-100"} onClick={(e) => handlePrint(e, rec.id)} />
								</div>)}
								<div className="col">
									<GridDeleteButton path={`/reclamos/delete/${rec.id}`} onDelete={(e) => onDeleteRecord(e, rec.id, getDeleteMessage(rec))}
										className={"w-100"}/>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</>
	);
}