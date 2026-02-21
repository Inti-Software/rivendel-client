import { Reclamos } from "../../api/endpointsConfiguration";
import { CUSTOM_COLUMN } from "../Shared/constants.jsx";
import Grid from "../Grid/Grid";
import ListCell from "./ListCell.jsx";
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

  return (
    <Container pathToNew="/reclamos/new">
      <NotificationDisplay />
      <Grid columnBuilder={rowGenerator} endpoints={Reclamos} />
    </Container>
  );
};

export default ListReclamos;