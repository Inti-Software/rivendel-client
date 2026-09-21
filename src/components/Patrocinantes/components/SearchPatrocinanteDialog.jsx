import { Patrocinantes } from '../../../api/repositories/patrocinantes';
import ModalSearchDialog from '../../SearchDialog/ModalSearchDialog';

const COLUMNS = [
	{ key: "nombre", label: "Nombre" },
	{ key: "nroMatricula", label: "Matrícula" },
	{ key: "nroCasillero", label: "Casillero" }
];

const SearchPatrocinanteDialog = ({ handleAccept, handleCancel }) => (
	<ModalSearchDialog
		title="Patrocinantes"
		placeholder="Nombre o Nro. de Matrícula"
		columns={COLUMNS}
		searchFn={(term) => Patrocinantes.findAll({ query: term })}
		onAccept={handleAccept}
		onCancel={handleCancel}
	/>
);

export default SearchPatrocinanteDialog;