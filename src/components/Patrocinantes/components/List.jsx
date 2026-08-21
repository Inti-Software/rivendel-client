import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../Shared/constants.js";
import { Patrocinantes } from "../../../api/endpoints/patrocinantes.js";
import Grid from "../../Grid/Grid.jsx";
import DeleteMessage from "../../Shared/DeleteMessage.jsx"
import Container from "../../Shared/Container.jsx";

export default function List() {
	const headers = ["Nombre", "Matrícula", "Domicilio", "Localidad", "Casillero", ""];	
  const searchPlaceHolder = "Nombre, matrícula o casillero"
	
	const rowGenerator = ({ data: pat }) => {
		return {
			key: pat.id,
			columns: [
				{type: DATA_COLUMN, data: pat.nombre },
				{type: DATA_COLUMN, data: pat.nroMatricula },
				{type: DATA_COLUMN, data: pat.domicilio },
				{type: DATA_COLUMN, data: pat.localidad },
				{type: DATA_COLUMN, data: pat.nroCasillero },
				{type: BUTTON_COLUMN, 
					buttons: [
						{ type: EDIT_BUTTON, path: `/patrocinantes/edit/${pat.id}` },
						{ type: DELETE_BUTTON, 
							path: `/patrocinantes/delete/${pat.id}`,
							id: pat.id,
							message: (<DeleteMessage message={"¿Está seguro que desea eliminar este patrocinante?"}
								fields={pat.nroMatricula + " - " + pat.nombre} />)
						},
					]
				},
			],
		};
	}

	return (
		<Container pathToNew="/patrocinantes/new">
			<Grid columnBuilder={rowGenerator} recordsPerPage={50} headers={headers} 
				showSearchBar={true} searchPlaceHolder={searchPlaceHolder} endpoints={Patrocinantes} />
		</Container>
  );
}