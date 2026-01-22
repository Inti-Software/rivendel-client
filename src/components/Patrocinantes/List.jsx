import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../utils/constants.jsx";
import { Patrocinantes } from "../../utils/endpoints.jsx";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import CustomList from "../Shared/CustomList";
import DeleteMessage from "../Shared/DeleteMessage.jsx"
import { useTitle } from "../Shared/hooks/useTitle.js";

export default function List() {
  const recordsPerPage = 50
	const headers = ["Nombre", "Matrícula", "Domicilio", "Localidad", "Casillero", ""];	
  const showSearchBar = true
  const searchPlaceHolder = "Nombre, matrícula o casillero"
	
	const rowGenerator = (pat) => {
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

	const properties = {
		title: "Patrocinantes",
		rowGenerator,
		recordsPerPage,
		headers,
		showSearchBar,
		searchPlaceHolder,
		pathToNew: "/patrocinantes/new",
	}

	const events = {
		onFetchData,
		onDeleteRow,
	}

	useTitle("Patrocinantes");
	return CustomList(properties, events);
}