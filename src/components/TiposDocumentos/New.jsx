import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { useTipoDocumento } from "./hooks/useTipoDocumento";
import { ACTION_CREATE } from "../../utils/constants";

const NewTipoDocumento = () => {
  const request = async ({sintetico, descripcion}) => {
      return fetch(`http://localhost:3000/tipdocs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sintetico, descripcion }),
      });
    };

  const {fields, error, handleSubmit} = useTipoDocumento (request, ACTION_CREATE);
  
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
