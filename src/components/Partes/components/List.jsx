import { Partes } from "../../../api/endpoints/partes";
import { CUSTOM_COLUMN } from "../../Shared/constants";
import Grid from "../../Grid/Grid";
import ListCell from "./ListCell.jsx";
import Container from "../../Shared/Container.jsx";

const ListPartes = () => {
	const rowGenerator = ({ data, onDelete }) => {
		return {
			key: data.id,
			columns: [
				{type: CUSTOM_COLUMN, content: ListCell(data, onDelete) },
			],
		};
	}
  const searchPlaceHolder = "Nombre o CUIL/CUIT";

  return (
    <Container pathToNew="/partes/new">
      <Grid columnBuilder={rowGenerator} showSearchBar={true} searchPlaceHolder={searchPlaceHolder} 
				endpoints={Partes} />
    </Container>
  );
};

export default ListPartes;
