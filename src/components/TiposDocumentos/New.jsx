import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { useTipoDocumento } from "./hooks/useTipoDocumento";
import { ACTION_CREATE } from "../../api/endpoints";
import { TiposDocumento } from "../../api/endpoints/tiposDocumentos";

const NewTipoDocumento = () => {
  const {fields, error, handleSubmit} = useTipoDocumento (TiposDocumento.create, ACTION_CREATE);
  
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
