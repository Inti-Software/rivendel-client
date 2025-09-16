import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_UPDATE } from "../../utils/constants";
import { useResolucion } from "./hooks/useResolucion";
import { Resoluciones } from "../../utils/endpoints";

const EditResolucion = () => {
	const {fields, error, handleSubmit} = useResolucion (Resoluciones.update, 
		ACTION_UPDATE, Resoluciones.get);

	return (
		<FormContainer 
			title="Edición de Resolución" 
			error={error} 
			handleSubmit={handleSubmit} 
			body={FormFields(fields)} />
	);
};

export default EditResolucion;
