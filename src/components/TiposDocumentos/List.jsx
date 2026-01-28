import { TiposDocumento } from "../../utils/endpoints";
import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../utils/constants.jsx";
import { fetchEndpointFactory, deleteEndpointFactory } from "../../utils/endpointFactory.jsx";
import Grid from "../Grid/Grid";
import DeleteMessage from "../Shared/DeleteMessage.jsx"
import Container from "../Shared/Container.jsx";
import NotificationDisplay from "../Shared/NotificationDisplay.jsx";

const ListTiposDocumentos = () => {
	const headers = ["Sintético", "Descripción", ""];
	
	const rowGenerator = ({ data: doc }) => {
		return {
			key: doc.id,
			columns: [
				{type: DATA_COLUMN, data: doc.sintetico },
				{type: DATA_COLUMN, data: doc.descripcion },
				{type: BUTTON_COLUMN, 
					buttons: [
						{ type: EDIT_BUTTON, path: `/tipos-documentos/edit/${doc.id}` },
						{ type: DELETE_BUTTON, 
							path: `/tipos-documentos/delete/${doc.id}`,
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

  return (
    <Container pathToNew="/tipos-documentos/new">
      <NotificationDisplay />
      <Grid columnBuilder={rowGenerator} recordsPerPage={50} headers={headers} 
				onFetchData={onFetchData} onDeleteRow={onDeleteRow} />
    </Container>
  );
};

export default ListTiposDocumentos;