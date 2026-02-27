import dayjs from "dayjs";
import { RECLAMANTE, RECLAMADO } from "../Shared/constants";
import DeleteMessage from "../Shared/DeleteMessage.jsx"
import { GridEditButton, GridDeleteButton, GridPrintButton } from "../Grid/GridButtons.jsx";

const getDeleteMessage = (rec) => {
	const s = `¿Está seguro que desea eliminar el reclamo Nº ${rec.numero}?`;
	return (<DeleteMessage message={s} />)
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
								<div className="col-3">
									<h6>Inicio</h6>
									<span>{dayjs(rec.fechaHoraInicio).format("DD [de] MMMM [de] YYYY - HH:mm [hs]")}</span>
								</div>
								<div className="col-3">
									<h6>Fin</h6>
									<span>
										{dayjs(rec.horaFin).isValid() ? dayjs(rec.horaFin).format("HH:mm [hs]") : "-"}
									</span>
								</div>
								<div className="col-4">
									<h6>Resolución</h6>
									<span>{rec.resolucion.descripcion}</span>
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
								<div className="col mb-1">
									<GridPrintButton path={`/reclamos/reporte/${rec.id}`} className={"w-100"} />
								</div>
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