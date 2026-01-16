import { TiposDocumento } from "../../utils/endpoints";
import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../utils/constants.jsx";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import CustomList from "../Shared/CustomList";
import DeleteMessage from "../Shared/DeleteMessage.jsx"

const ListTiposDocumentos = () => {
  const recordsPerPage = 50
	const headers = ["Sintético", "Descripción", ""];
  const showSearchBar = false
	
	const rowGenerator = (doc) => {
		return {
			key: doc.id,
			columns: [
				{type: DATA_COLUMN, data: doc.sintetico },
				{type: DATA_COLUMN, data: doc.descripcion },
				{type: BUTTON_COLUMN, 
					buttons: [
						{ type: EDIT_BUTTON, path: `/tipos-documento/edit/${doc.id}` },
						{ type: DELETE_BUTTON, 
							path: `/tipos-documento/delete/${doc.id}`,
							id: doc.id,
							message: (
                <DeleteMessage key={1} message={"¿Está seguro que desea eliminar este tipo de documento?"} 
                    fields={doc.sintetico + " - " + doc.descripcion} />
                )
						},
					]
				},
			],
		};
	}

	const onFetchData = fetchEndpointFactory(TiposDocumento.findAll);

	const onDeleteRow = deleteEndpointFactory(TiposDocumento.delete);

	const properties = {
		rowGenerator,
		recordsPerPage,
		headers,
		showSearchBar
	}

	const events = {
		onFetchData,
		onDeleteRow,
	}

	return CustomList(properties, events);
};

export default ListTiposDocumentos;