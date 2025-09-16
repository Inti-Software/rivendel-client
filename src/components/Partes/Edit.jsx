import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { ACTION_UPDATE } from "../../utils/constants";
import { Partes, TiposDocumento } from "../../utils/endpoints";
import { useEffect, useState } from "react";
import { useParte } from "./hooks/useParte";

const EditParte = () => {
  const [tiposDocumento, setTiposDocumento] = useState([])
  const {fields, error, handleSubmit} = useParte(Partes.update, 
    ACTION_UPDATE, Partes.get);

  useEffect(() => {
    const fetchData = async () => {
      const response = await TiposDocumento.findAll({})
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tiposDocumento = await response.json();
      let result = tiposDocumento.map(td => {
        return { 
          value: td.id, 
          text: td.sintetico 
        };
      });
      setTiposDocumento(result);
    }

    fetchData();
  }, []);    

  return (
    <FormContainer 
      title="Edición de Partes"
      error={error} 
      handleSubmit={handleSubmit} 
      body={FormFields({...fields, tiposDocumento})} />
  );
};

export default EditParte;
