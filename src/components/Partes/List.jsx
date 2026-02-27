import { Partes } from "../../api/endpoints/partes";
import { CUSTOM_COLUMN } from "../Shared/constants";
import Grid from "../Grid/Grid";
import ListCell from "./ListCell.jsx";
import Container from "../Shared/Container.jsx";
import NotificationDisplay from "../Shared/NotificationDisplay.jsx";

const ListPartes = () => {
	const rowGenerator = ({ data, onDelete }) => {
		return {
			key: data.id,
			columns: [
				{type: CUSTOM_COLUMN, content: ListCell(data, onDelete) },
			],
		};
	}

  return (
    <Container pathToNew="/partes/new">
      <NotificationDisplay />
      <Grid columnBuilder={rowGenerator} endpoints={Partes} />
    </Container>
  );
};

export default ListPartes;
