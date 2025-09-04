import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { usePatrocinante } from "./hooks/usePatrocinante";
import { ACTION_CREATE } from "../../utils/constants";

const NewPatrocinante = () => {
  const request = async ({nombre, nroMatricula, domicilio, localidad, nroCasillero}) => {
      return fetch(`http://localhost:3000/patrocinantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, nroMatricula, domicilio, localidad, nroCasillero }),
      });
    };

  const {fields, error, handleSubmit} = usePatrocinante (request, ACTION_CREATE);
  
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
