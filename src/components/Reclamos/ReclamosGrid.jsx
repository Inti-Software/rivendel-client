import Grid from "../Grid/Grid";
import { GridEditButton, GridDeleteButton, GridPrintButton } from "../Grid/GridButtons";
import { useState } from "react";
import { useNotification } from "../../contexts/Constants";
import DeleteDialog from "../Modals/DeleteDialog";
import { TiposDocumento } from "../../utils/endpoints";

const ReclamosGrid = ({data, currentPage, totalPages, setData, setCurrentPage}) => {
  const [onDeleteId, setOnDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { showSuccess, showError } = useNotification();

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
        <h3>{rec.numero}</h3>
        <>
          <GridPrintButton path={`/reclamos/reporte/${rec.id}`} />
          <GridEditButton path={`/reclamos/edit/${rec.id}`} />
          <GridDeleteButton onDelete={(e) => onDeleteRecord(e, rec.id, rec.sintetico)}
            />
        </>
        </>
      ],
    };
  };

  return (    
    <>
      <div id="pdf"></div>
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

export default ReclamosGrid;
