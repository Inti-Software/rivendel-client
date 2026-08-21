import { Patrocinantes } from '../../../api/endpoints/patrocinantes';
import SearchDialogContainer from '../../Shared/SearchDialogContainer';

const COLUMNS = [
	{ key: "nombre", label: "Nombre" },
	{ key: "nroMatricula", label: "Matrícula" },
	{ key: "nroCasillero", label: "Casillero" }
];

const SearchPatrocinanteDialog = ({ handleAccept, handleCancel }) => (
	<SearchDialogContainer
		title="Patrocinantes"
		placeholder="Nombre o Nro. de Matrícula"
		columns={COLUMNS}
		searchFn={(term) => Patrocinantes.findAll({ query: term })}
		onAccept={handleAccept}
		onCancel={handleCancel}
	/>
);

export default SearchPatrocinanteDialog;