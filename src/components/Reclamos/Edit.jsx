import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_UPDATE } from "../../utils/constants";
import { useReclamo } from "./hooks/useReclamo";
import { Reclamos } from "../../utils/endpoints";

const EditTipoDocumento = () => {
  const {fields, error, handleSubmit} = useReclamo (Reclamos.update, 
    ACTION_UPDATE, Reclamos.get);

  return (
    <FormContainer 
      title="Edición de Reclamos" 
      error={error} 
      handleSubmit={handleSubmit} 
      body={FormFields(fields)} />
  );
};

export default EditTipoDocumento;
