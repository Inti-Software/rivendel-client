import { Reclamos } from "../../utils/endpoints";
import { CUSTOM_COLUMN } from "../../utils/constants";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import Grid from "../Shared/Grid";
import ListCell from "./ListCell.jsx";
import { useTitle } from "../Shared/hooks/useTitle.js";
import Container from "../Shared/Container.jsx";
import NotificationDisplay from "../Shared/NotificationDisplay.jsx";

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

	useTitle("Reclamos");

  return (
    <Container title="Reclamos" pathToNew="/reclamos/new">
      <NotificationDisplay />
      <Grid columnBuilder={rowGenerator} onFetchData={onFetchData} onDeleteRow={onDeleteRow} />
    </Container>
  );
};

export default ListReclamos;