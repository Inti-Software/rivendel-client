import { useNotification } from "../../../contexts/Constants";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACTION_CREATE } from "../../../utils/constants";
import { useParams } from "react-router-dom";

export function useReclamo(request, accion, getRequest) {
  const [numero, setNumero] = useState(0);
  const [reclamantes, setReclamantes] = useState([]);
  const [reclamados, setReclamados] = useState([]);
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
          setNumero(data.numero);
          setReclamantes(data.reclamantes || []);
          setReclamados(data.reclamados || []);
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
      const idsReclamantes = reclamantes.map((r) => r.id);
      const idsReclamados = reclamados.map((r) => r.id);
      const response = await request({id, numero, reclamantes: idsReclamantes, reclamados: idsReclamados});
      if (response.ok) {
        showSuccess(
          "El reclamo Nº " + numero +
            ` se ${
              accion === ACTION_CREATE ? "creó" : "actualizó"
            } correctamente.`
        );
        setNumero(0);
        setReclamantes([]);
        setReclamados([]);
        setError(null);
        navigate("/reclamos");
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
    fields: { numero, setNumero, reclamantes, setReclamantes, reclamados, setReclamados },
    error,
    handleSubmit,
  };
}
