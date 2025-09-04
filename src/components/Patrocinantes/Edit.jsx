import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_UPDATE } from "../../utils/constants";
import { usePatrocinante } from "./hooks/usePatrocinante";

const EditPatrocinante = () => {
  const postRequest = async ({id, nombre, nroMatricula, domicilio, localidad, nroCasillero}) => {
    return fetch(
        `http://localhost:3000/patrocinantes/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, nroMatricula, domicilio, localidad, nroCasillero }),
        }
      );
    };

  const getRequest = async (id) => {
    return fetch(`http://localhost:3000/patrocinantes/${id}`);
  }

  const {fields, error, handleSubmit} = usePatrocinante(postRequest, ACTION_UPDATE, getRequest);

  return (
    <FormContainer 
      title="Edición de Patrocinante" 
      error={error} 
      handleSubmit={handleSubmit} 
      body={FormFields(fields)} />
  );
};

export default EditPatrocinante;
