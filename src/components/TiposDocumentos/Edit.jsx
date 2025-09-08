import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_UPDATE } from "../../utils/constants";
import { useTipoDocumento } from "./hooks/useTipoDocumento";
import { TiposDocumento } from "../../utils/endpoints";

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
