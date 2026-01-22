import { Resoluciones } from "../../utils/endpoints";
import { BUTTON_COLUMN, DATA_COLUMN, EDIT_BUTTON, DELETE_BUTTON, RECORDS_PER_PAGE } from "../../utils/constants";
import { useTitle } from "../Shared/hooks/useTitle";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory";
import CustomList from "../Shared/CustomList";
import DeleteMessage from "../Shared/DeleteMessage.jsx"

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

	const properties = {
		title: "Resoluciones",
		rowGenerator,
		recordsPerPage: RECORDS_PER_PAGE,
		showSearchBar: false,
		pathToNew: "/resoluciones/new",
	}

	const events = {
		onFetchData,
		onDeleteRow,
	}

	useTitle("Resoluciones");
	return CustomList(properties, events);
};

export default ListResoluciones;
