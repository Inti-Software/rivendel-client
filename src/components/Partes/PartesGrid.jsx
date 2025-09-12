import Grid from "../Grid/Grid";
import { GridEditButton, GridDeleteButton } from "../Grid/GridButtons";
import { useState } from "react";
import { useNotification } from "../../contexts/Constants";
import DeleteDialog from "../Modals/DeleteDialog";
import { TiposDocumento } from "../../utils/endpoints";

const PartesGrid = ({data, currentPage, totalPages, setData, setCurrentPage}) => {
  const [onDeleteId, setOnDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { showSuccess, showError } = useNotification();

	/**
	 * 
"id": 1,
"nroDocumento": "25123123",
"cuil": "20251231230",
"nombre": "Pedro Paz",
"localidad": "Árraga",
"nroWhatsapp": "+5493854123456",
"idTipoDocumento": 2,
"tipoDocumento": "LC",
"idPatrocinante": 3,
"patrocinante": "1234 - Juan Pérez"
	 */

  const headers = ["Documento", "Nombre", "Domicilio", "Patrocinante", ""];

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

  const row = (p) => {
    return {
      key: p.id,
      columns: [
        `${p.tipoDocumento} ${p.nroDocumento}`,
				p.nombre,
				p.domicilio,
				p.patrocinante,
        <>
          <GridEditButton path={`/partes/edit/${p.id}`} />
          <GridDeleteButton
            onDelete={(e) => onDeleteRecord(e, p.id, p.nombre)}
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

export default PartesGrid;
