import { Resoluciones } from "../../utils/endpoints";
import { BUTTON_COLUMN, DATA_COLUMN, EDIT_BUTTON, DELETE_BUTTON, RECORDS_PER_PAGE } from "../../utils/constants";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory";
import Grid from "../Grid/Grid";
import DeleteMessage from "../Shared/DeleteMessage.jsx"
import Container from "../Shared/Container.jsx";
import NotificationDisplay from "../Shared/NotificationDisplay.jsx";

const ListResoluciones = () => {
	const getDeleteMessage = (r) =>
		<DeleteMessage message={`¿Está seguro que desea eliminar esta resolución?`}
			fields={r.descripcion} />

	const rowGenerator = ({ data }) => {
		return {
			key: data.id,
			columns: [
				{ type: DATA_COLUMN, data: data.descripcion },
				{ type: DATA_COLUMN, data: data.detalle.substring(0, 75) + (data.detalle.length > 75 ? "..." : "") },
				{ type: BUTTON_COLUMN, buttons: [
					{ type: EDIT_BUTTON, path: `/resoluciones/edit/${data.id}` },
					{ type: DELETE_BUTTON, path: `/resoluciones/delete/${data.id}`, id: data.id, message: getDeleteMessage(data) },
				] },
			],
		};
	}

	const onFetchData = fetchEndpointFactory(Resoluciones.findAll);

	const onDeleteRow = deleteEndpointFactory(Resoluciones.delete);

  return (
    <Container pathToNew="/resoluciones/new">
      <NotificationDisplay />
      <Grid columnBuilder={rowGenerator} onFetchData={onFetchData} onDeleteRow={onDeleteRow} />
    </Container>
  );
};

export default ListResoluciones;
