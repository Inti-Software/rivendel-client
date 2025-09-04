import Grid from "../Grid/Grid";
import { GridEditButton, GridDeleteButton } from "../Grid/GridButtons";
import { useState } from "react";
import { useNotification } from "../../contexts/Constants";
import DeleteDialog from "../Modals/DeleteDialog";

const PatrocinantesGrid = ({data, currentPage, totalPages, setData, setCurrentPage}) => {
	const [onDeleteId, setOnDeleteId] = useState(null);
	const [deleteMessage, setDeleteMessage] = useState("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const { showSuccess, showError } = useNotification();

	const headers = ["Nombre", "Matrícula", "Domicilio", "Localidad", "Casillero", ""];

  const onDeleteRecord = (e, id, descripcion) => {
    e.preventDefault();
    setOnDeleteId(id);
    setShowDeleteDialog(true);
    setDeleteMessage(
      <>
        ¿Está seguro de eliminar el patrocinante
        <span className="fw-bold text-danger ms-1">{descripcion}</span>?
      </>
    );
  };

  const deleteRequest = async (id) => fetch(
    `http://localhost:3000/patrocinantes/${id}`, {
    method: "DELETE"
  });

  const handleDelete = async () => {
    try {
      const response = await deleteRequest(onDeleteId);
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

	const row = (pat) => {
		return {
			key: pat.id,
			columns: [
				pat.nombre,
				pat.nroMatricula,
				pat.domicilio,
				pat.localidad,
				pat.nroCasillero,
				<>
					<GridEditButton path={`/patrocinantes/edit/${pat.id}`} />
					<GridDeleteButton onDelete={(e) => onDeleteRecord(e, pat.id, `${pat.nroMatricula} - ${pat.nombre}`)} />
				</>
			],
		};
	}    

	return (
		<>
			<Grid headers={headers}
				row={row}
				data={data}
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

}

export default PatrocinantesGrid;