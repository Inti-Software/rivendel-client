import { Partes } from "../../utils/endpoints";
import { RECORDS_PER_PAGE } from "../../utils/constants";
import { CUSTOM_COLUMN } from "../../utils/constants.jsx";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import CustomList from "../Shared/CustomList";
import ListCell from "./ListCell.jsx";
import { useTitle } from "../Shared/hooks/useTitle.js";

const ListPartes = () => {
  const showSearchBar = false

	const rowGenerator = (parte, onDeleteRecord) => {
		return {
			key: parte.id,
			columns: [
				{type: CUSTOM_COLUMN, content: ListCell(parte, onDeleteRecord) },
			],
		};
	}

	const onFetchData = fetchEndpointFactory(Partes.findAll);

	const onDeleteRow = deleteEndpointFactory(Partes.delete);

	const properties = {
		title: "Partes",
		rowGenerator,
		recordsPerPage: RECORDS_PER_PAGE,
		showSearchBar,
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
