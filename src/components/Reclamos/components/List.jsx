import { Reclamos } from "../../../api/endpoints/reclamos.js";
import { CUSTOM_COLUMN } from "../../Shared/constants.js";
import Grid from "../../Grid/Grid.jsx";
import ListCell from "../components/ListCell.jsx";
import Container from "../../Shared/Container.jsx";

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
      <Grid columnBuilder={rowGenerator} endpoints={Reclamos} showSearchBar={true}
				searchPlaceHolder={"Número o fecha de reclamo, nombre de una parte o fecha"} />
    </Container>
  );
};

export default ListReclamos;