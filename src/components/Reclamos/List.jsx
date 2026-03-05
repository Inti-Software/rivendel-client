import { Reclamos } from "../../api/endpoints";
import { CUSTOM_COLUMN } from "../Shared/constants";
import Grid from "../Grid/Grid";
import ListCell from "./ListCell.jsx";
import Container from "../Shared/Container.jsx";

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
      <Grid columnBuilder={rowGenerator} endpoints={Reclamos} />
    </Container>
  );
};

export default ListReclamos;