import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../utils/constants.jsx";
import { Patrocinantes } from "../../utils/endpoints.jsx";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import Grid from "../Grid/Grid";
import DeleteMessage from "../Shared/DeleteMessage.jsx"
import { useTitle } from "../Shared/hooks/useTitle.js";
import Container from "../Shared/Container.jsx";
import NotificationDisplay from "../Shared/NotificationDisplay.jsx";

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

	const onFetchData = fetchEndpointFactory(Patrocinantes.findAll);

	const onDeleteRow = deleteEndpointFactory(Patrocinantes.delete);

	useTitle("Patrocinantes");

	return (
		<Container title="Patrocinantes" pathToNew="/patrocinantes/new">
			<NotificationDisplay />
			<Grid columnBuilder={rowGenerator} recordsPerPage={50} headers={headers} 
				showSearchBar={true} searchPlaceHolder={searchPlaceHolder} onFetchData={onFetchData} 
				onDeleteRow={onDeleteRow} />
		</Container>
  );
}