import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_CREATE } from "../../utils/constants";
import { TiposDocumento } from "../../utils/endpoints";
import { useReclamo } from "./hooks/useReclamo";

const NewTipoDocumento = () => {
  const {fields, error, handleSubmit} = useReclamo (TiposDocumento.create, ACTION_CREATE);
  
  return (
    <FormContainer 
      title="Nuevo Tipo de Documento" 
      error={error}
      handleSubmit={handleSubmit} 
      body={FormFields(fields)}
    />
  );
};

export default NewTipoDocumento;
