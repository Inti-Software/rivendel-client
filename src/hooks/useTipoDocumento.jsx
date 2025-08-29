import { useNotification } from "../contexts/Constants";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACTION_CREATE } from "../utils/constants";
import { useParams } from "react-router-dom";

export function useTipoDocumento(request, accion, getRequest) {
  const [sintetico, setSintetico] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const { id } = useParams();

  useEffect(() => {
    if (isNaN(id)) return;

    try {
      const fetchData = async () => {
        const response = await getRequest(id);
        if (response.ok) {
          const data = await response.json();
          setSintetico(data.sintetico);
          setDescripcion(data.descripcion);
        } else {
          const msg = await response.json();
          setError([msg.code + ": " + msg.message]);
        }
      };
      fetchData();
    } catch (err) {
      setError(["Error de conexión: " + err.message]);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await request({id, sintetico, descripcion});
      if (response.ok) {
        showSuccess(
          "El tipo de documento " +
            sintetico +
            ` se ${
              accion === ACTION_CREATE ? "creó" : "actualizó"
            } correctamente.`
        );
        setSintetico("");
        setDescripcion("");
        setError(null);
        navigate("/tipos-documentos");
      } else {
        const body = await response.json();
        setError(body.message);
      }
    } catch (error) {
      console.log("Error de conexión: " + error.message);
      setError(["Error al intentar ejecutar la transacción."]);
    }
  };

  return {
    fields: { sintetico, setSintetico, descripcion, setDescripcion },
    error,
    handleSubmit,
  };
}
