import { Partes } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";
import { CUSTOM_COLUMN } from "../../utils/constants.jsx";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import CustomList from "../Shared/CustomList";
import ListCell from "./ListCell.jsx";
import { useTitle } from "../Shared/hooks/useTitle.js";

const ListPartes = () => {
	const rowGenerator = ({ data, onDelete }) => {
		return {
			key: data.id,
			columns: [
				{type: CUSTOM_COLUMN, content: ListCell(data, onDelete) },
			],
		};
	}

	const onFetchData = fetchEndpointFactory(Partes.findAll);

	const onDeleteRow = deleteEndpointFactory(Partes.delete);

	const properties = {
		title: "Partes",
		rowGenerator,
		recordsPerPage: RECORDS_PER_PAGE,
		showSearchBar: false,
		pathToNew: "/partes/new",
	}

	const events = {
		onFetchData,
		onDeleteRow,
	}

	useTitle("Partes");
	return CustomList(properties, events);
};

export default ListPartes;
