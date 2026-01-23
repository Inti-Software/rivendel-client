import { Reclamos } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";
import { CUSTOM_COLUMN } from "../../utils/constants.jsx";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import CustomList from "../Shared/CustomList";
import ListCell from "./ListCell.jsx";
import { useTitle } from "../Shared/hooks/useTitle.js";

const ListReclamos = () => {
	const rowGenerator = ({ data, onDelete }) => {
		return {
			key: data.id,
			columns: [
				{type: CUSTOM_COLUMN, content: ListCell(data, onDelete) },
			],
		};
	}

	const onFetchData = fetchEndpointFactory(Reclamos.findAll);

	const onDeleteRow = deleteEndpointFactory(Reclamos.delete);

	const properties = {
		title: "Reclamos",
		rowGenerator,
		recordsPerPage: RECORDS_PER_PAGE,
		showSearchBar: false,
		pathToNew: "/reclamos/new",
	}

	const events = {
		onFetchData,
		onDeleteRow,
	}

	useTitle("Reclamos");
	return CustomList(properties, events);
};

export default ListReclamos;