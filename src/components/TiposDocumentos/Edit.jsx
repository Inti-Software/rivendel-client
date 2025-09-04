import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_UPDATE } from "../../utils/constants";
import { useTipoDocumento } from "./hooks/useTipoDocumento";

const EditTipoDocumento = () => {
  const postRequest = async ({id, sintetico, descripcion}) => {
    return fetch(
        `http://localhost:3000/tipdocs/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sintetico, descripcion }),
        }
      );
    };

  const getRequest = async (id) => {
    return fetch(`http://localhost:3000/tipdocs/${id}`);
  }

  const {fields, error, handleSubmit} = useTipoDocumento (postRequest, ACTION_UPDATE, getRequest);

  return (
    <FormContainer 
      title="Edición de Tipo de Documento" 
      error={error} 
      handleSubmit={handleSubmit} 
      body={FormFields(fields)} />
  );
};

export default EditTipoDocumento;
