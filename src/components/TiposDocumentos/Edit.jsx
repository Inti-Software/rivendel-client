import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { useTipoDocumento } from "./hooks/useTipoDocumento";
import { ACTION_UPDATE } from "../../api/endpoints";
import { TiposDocumento } from "../../api/endpoints/tiposDocumentos";

const EditTipoDocumento = () => {
  const {fields, error, handleSubmit} = useTipoDocumento (TiposDocumento.update, 
    ACTION_UPDATE, TiposDocumento.get);

  return (
    <FormContainer 
      title="Edición de Tipo de Documento" 
      error={error} 
      handleSubmit={handleSubmit} 
      body={FormFields(fields)} />
  );
};

export default EditTipoDocumento;
