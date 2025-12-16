import CustomGrid from "../Grid/Grid";
import { GridEditButton, GridDeleteButton } from "../Grid/GridButtons";
import { useState } from "react";
import { useNotification } from "../../contexts/Constants";
import DeleteDialog from "../Modals/DeleteDialog";
import { Resoluciones } from "../../utils/endpoints";

export default function Grid({data, currentPage, totalPages, setData, setCurrentPage}) {
	const [onDeleteId, setOnDeleteId] = useState(null);
	const [deleteMessage, setDeleteMessage] = useState("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const { showSuccess, showError } = useNotification();

	const headers = ["Detalle", "Descripción", ""];

	const onDeleteRecord = (e, id, descripcion) => {
		e.preventDefault();
		setOnDeleteId(id);
		setShowDeleteDialog(true);
		setDeleteMessage(
			<>
				¿Está seguro de eliminar la resolución 
				<span className="fw-bold text-danger ms-1">{descripcion}</span>?
			</>
		);
	};
	
	const handleDelete = async () => {
		try {
			const response = await Resoluciones.delete(onDeleteId);
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

	const row = (res) => {
		return {
			key: res.id,
			columns: [
				res.descripcion,
				res.detalle.substring(0, 75) + (res.detalle.length > 75 ? "..." : ""),
				<>
					<GridEditButton path={`/resoluciones/edit/${res.id}`} />
					<GridDeleteButton
						path={`/resoluciones/delete/${res.id}`}
						onDelete={(e) => onDeleteRecord(e, res.id, res.descripcion)}
					/>
				</>,
			],
		};
	};

	return (
		<>
			<CustomGrid data={data}
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
