import CustomGrid from "../Grid/Grid";
import { GridEditButton, GridDeleteButton, GridPrintButton } from "../Grid/GridButtons";
import { useState } from "react";
import { useNotification } from "../../contexts/Constants";
import DeleteDialog from "../Modals/DeleteDialog";
import { TiposDocumento } from "../../utils/endpoints";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { RECLAMADO, RECLAMANTE } from "../../utils/constants";

export default function Grid({data, currentPage, totalPages, setData, setCurrentPage}) {
  const [onDeleteId, setOnDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { showSuccess, showError } = useNotification();
  dayjs.locale(es);

  const onDeleteRecord = (e, id, sintetico) => {
    e.preventDefault();
    setOnDeleteId(id);
    setShowDeleteDialog(true);
    setDeleteMessage(
      <>
        ¿Está seguro de eliminar el tipo de documento
        <span className="fw-bold text-danger ms-1">{sintetico}</span>?
      </>
    );
  };
  
  const handleDelete = async () => {
    try {
      const response = await TiposDocumento.delete(onDeleteId);
      if (!response.ok) {
        console.log(
          `HTTP error! status: ${response.status} - ${response.body}`
        );
        throw new Error(
          "Se produjo un error al intentar eliminar el registro."
        );
      }
      setData((prevData) => prevData.filter((doc) => doc.id !== onDeleteId));
      showSuccess("Se eliminó correctamente el registro.");
      setShowDeleteDialog(false);
    } catch (error) {
      showError(`Error al eliminar: ${error.message}`);
    }
  };

  const row = (rec) => {
    return {
      key: rec.id,
      columns: [
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
                      <GridEditButton path={`/reclamos/form/${rec.id}`} className={"w-100"} />
                    </div>
                    <div className="col mb-1">
                      <GridPrintButton path={`/reclamos/reporte/${rec.id}`} className={"w-100"} />
                    </div>
                    <div className="col">
                      <GridDeleteButton onDelete={(e) => onDeleteRecord(e, rec.id, rec.sintetico)}  className={"w-100"}/>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </>
      ],
    };
  };

  return (    
    <>
      <div id="pdf"></div>
      <CustomGrid data={data}
        headers={null}
        row={row}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      { showDeleteDialog && 
        <DeleteDialog
          deleteMessage={deleteMessage}
          handleDelete={handleDelete}
          handleCancel={() => setShowDeleteDialog(false)}
        />
      }
    </>
  );
};
