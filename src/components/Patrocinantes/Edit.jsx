import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_UPDATE } from "../../utils/constants";
import { Patrocinantes } from "../../utils/endpoints";
import { usePatrocinante } from "./hooks/usePatrocinante"

const EditPatrocinante = () => {
  const {fields, error, handleSubmit} = usePatrocinante(Patrocinantes.update, 
    ACTION_UPDATE, Patrocinantes.get);

  return (
    <FormContainer 
      title="Edición de Patrocinante" 
      error={error} 
      handleSubmit={handleSubmit} 
      body={FormFields(fields)} />
  );
};

export default EditPatrocinante;
