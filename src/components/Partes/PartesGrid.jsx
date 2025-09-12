import Grid from "../Grid/Grid";
import { GridEditButton, GridDeleteButton } from "../Grid/GridButtons";
import { useState } from "react";
import { useNotification } from "../../contexts/Constants";
import DeleteDialog from "../Modals/DeleteDialog";
import { Partes } from "../../utils/endpoints";

const PartesGrid = ({data, currentPage, totalPages, setData, setCurrentPage}) => {
  const [onDeleteId, setOnDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { showSuccess, showError } = useNotification();

  const onDeleteRecord = (e, id, nombre, cuil) => {
    e.preventDefault();
    setOnDeleteId(id);
    setShowDeleteDialog(true);
    setDeleteMessage(
      <>
        ¿Está seguro de eliminar la parte? <br/>
        <div className="row mt-2">
          <div className="col">
            <span className="fw-bold">Nombre: </span>
            <span className="fw-bold text-danger ms-1">{nombre}</span>
            <br />
            <span className="fw-bold">CUIL: </span>
            <span>{cuil}</span>
          </div>
        </div>
      </>
    );
  };
  
  const handleDelete = async () => {
    try {
      const response = await Partes.delete(onDeleteId);
      if (!response.ok) {
        console.log(
          `HTTP error! status: ${response.status} - ${response.body}`
        );
        throw new Error(
          "Se produjo un error al intentar eliminar el registro."
        );
      }
      setData((prevData) => prevData.filter((p) => p.id !== onDeleteId));
      showSuccess("Se eliminó correctamente el registro.");
      setShowDeleteDialog(false);
    } catch (error) {
      showError(`Error al eliminar: ${error.message}`);
    }
  };

  const row = (p) => {
    return {
      key: p.id,
      columns: [
        <>
          <div className="row">
            <div className="col-10 pt-1 pb-1 bg-primary-subtle rounded-2 mb-2">
              {p.nombre}
            </div>
            <div className="col d-flex justify-content-end">
              <GridEditButton path={`/partes/edit/${p.id}`} 
                style={{"--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"}}
              />
              <GridDeleteButton
                onDelete={(e) => onDeleteRecord(e, p.id, p.nombre, p.cuil)}
                style={{"--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"}}
                />
            </div>
          </div>
          <div className="row mb-2 h6 pt-2">
            <div className="col">
              <span className="fw-bold">Documento: </span>
              <span>{p.tipoDocumento} {p.nroDocumento}</span>
            </div>
            <div className="col">
              <span className="fw-bold">Cuil: </span>
              <span>{p.cuil}</span>
            </div>
            <div className="col">
              <span className="fw-bold">Nº Whatsapp: </span>
              <span>{p.nrowhatsapp}</span>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col">
              <span className="fw-bold">Domicilio: </span>
              <span>{p.domicilio}</span>
            </div>
            <div className="col">
              <span className="fw-bold">Localidad: </span>
              <span>{p.localidad}</span>
            </div>
          </div>
          <div className="row mb-2 border-bottom border-primary-subtle mt-3">
            <div className="col">
              <span className="fw-bold text-secondary">Patrocinante</span><br/>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              <span className="fw-bold">Nº Matrícula: </span> {p.patrocinante.nroMatricula}
            </div>
            <div className="col">
              <span className="fw-bold">Nombre: </span>{p.patrocinante.nombre}
            </div>
          </div>
        </>
      ],
    };
  };

  return (
    <>
      <Grid data={data}
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

export default PartesGrid;
