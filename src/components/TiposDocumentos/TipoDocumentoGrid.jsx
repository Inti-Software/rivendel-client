import Grid from "../Grid/Grid";
import { GridEditButton, GridDeleteButton } from "../Grid/GridButtons";
import { useState } from "react";
import { useNotification } from "../../contexts/Constants";
import DeleteDialog from "../Modals/DeleteDialog";
import { TiposDocumento } from "../../utils/endpoints";

const TipoDocumentoGrid = ({data, currentPage, totalPages, setData, setCurrentPage}) => {
  const [onDeleteId, setOnDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { showSuccess, showError } = useNotification();

  const headers = ["Sintético", "Descripción", ""];

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

  const row = (doc) => {
    return {
      key: doc.id,
      columns: [
        doc.sintetico,
        doc.descripcion,
        <>
          <GridEditButton path={`/tipos-documentos/edit/${doc.id}`} />
          <GridDeleteButton
            onDelete={(e) => onDeleteRecord(e, doc.id, doc.sintetico)}
          />
        </>,
      ],
    };
  };

  return (
    <>
      <Grid data={data}
        headers={headers}
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

export default TipoDocumentoGrid;
