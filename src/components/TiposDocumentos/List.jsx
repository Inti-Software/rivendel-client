import { TiposDocumento } from "../../api/endpoints/tiposDocumentos";
import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../Shared/constants";
import Grid from "../Grid/Grid";
import DeleteMessage from "../Shared/DeleteMessage.jsx"
import Container from "../Shared/Container.jsx";

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

  return (
    <Container pathToNew="/tipos-documentos/new">
      <Grid columnBuilder={rowGenerator} recordsPerPage={50} headers={headers} endpoints={TiposDocumento} />
    </Container>
  );
};

export default ListTiposDocumentos;