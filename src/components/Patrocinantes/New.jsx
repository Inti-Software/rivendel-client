import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { usePatrocinante } from "./hooks/usePatrocinante";
import { ACTION_CREATE } from "../../utils/constants";
import { Patrocinantes } from "../../utils/endpoints";

const NewPatrocinante = () => {
  const {fields, error, handleSubmit} = usePatrocinante (Patrocinantes.create, ACTION_CREATE);
  
  return (
    <FormContainer 
      title="Nuevo Patrocinante" 
      error={error}
      handleSubmit={handleSubmit} 
      body={FormFields(fields)}
    />
  );
};

export default NewPatrocinante;
