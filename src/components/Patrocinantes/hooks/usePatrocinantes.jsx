import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../../utils/constants.jsx";
import { Patrocinantes } from '../../../utils/endpoints.jsx'
import { fetchEndpointFactory, deleteEndpointFactory } from "../../../utils/endpointFactory.jsx";

export default function usePatrocinantes() {
	const rowGenerator = (pat) => {
		const getMessage = (pat) => (
			<>
				¿Está seguro de eliminar el siguiente patrocinante?
				<span className="fw-bold text-danger text-center d-block">
					{pat.nroMatricula} - {pat.nombre}
				</span>
				<span style={{ fontSize: "10px"}} className="text-secondary-subtle text-center pt-2 d-block">
					Esta operación no se puede deshacer.
				</span>
			</>
		)

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
							message: (getMessage(pat))
						},
					]
				},
			],
		};
	}	

	const onFetchData = fetchEndpointFactory(Patrocinantes.findAll);

	const onDeleteRow = deleteEndpointFactory(Patrocinantes.delete);
	
	return { rowGenerator, onFetchData, onDeleteRow };
}