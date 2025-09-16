import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { useResolucion } from "./hooks/useResolucion";
import { ACTION_CREATE } from "../../utils/constants";
import { Resoluciones } from "../../utils/endpoints";

const NewResolucion = () => {
  const {fields, error, handleSubmit} = useResolucion (Resoluciones.create, ACTION_CREATE);
  
  return (
    <FormContainer 
      title="Nueva Resolución" 
      error={error}
      handleSubmit={handleSubmit} 
      body={FormFields(fields)}
    />
  );
};

export default NewResolucion;
