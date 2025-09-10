import FormContainer from "../Layout/FormContainer";
import FormFields from "./FormFields";
import { useParte } from "./hooks/useParte";
import { ACTION_CREATE } from "../../utils/constants";
import { Partes, Patrocinantes, TiposDocumento } from "../../utils/endpoints";
import { useEffect, useState } from "react";

const NewParte = () => {
  const [tiposDocumento, setTiposDocumento] = useState([])
  const {fields, error, handleSubmit} = useParte(Partes.create, ACTION_CREATE);

  useEffect(() => {
    const fetchData = async () => {
      const response = await TiposDocumento.findAll()
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
      title="Nueva Parte"
      error={error}
      handleSubmit={handleSubmit} 
      body={FormFields({...fields, tiposDocumento})}
    />
  );
};

export default NewParte;
