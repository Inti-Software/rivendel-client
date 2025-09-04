import { useNotification } from "../../../contexts/Constants";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACTION_CREATE } from "../../../utils/constants";
import { useParams } from "react-router-dom";

export function usePatrocinante(request, accion, getRequest) {
  const [nombre, setNombre] = useState("");
  const [nroMatricula, setNroMatricula] = useState(0);
  const [domicilio, setDomicilio] = useState("")
  const [localidad, setLocalidad] = useState("")
  const [nroCasillero, setNroCasillero] = useState(0)
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
          setNombre(data.nombre);
          setNroMatricula(data.nroMatricula);
          setDomicilio(data.domicilio);
          setLocalidad(data.localidad);
          setNroCasillero(data.nroCasillero);
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
      const response = await request({id, nombre, nroMatricula, domicilio, localidad, nroCasillero});
      if (response.ok) {
        showSuccess(
          `El patrocinante ${nombre} se ${accion === ACTION_CREATE ? "creó" : "actualizó"} correctamente.`
        );
        setNombre("");
        setNroMatricula("");
        setDomicilio("")
        setLocalidad("")
        setNroCasillero("")
        setError(null);
        navigate("/patrocinantes");
      } else {
        const body = await response.json();
        setError(body.message);
      }
    } catch (error) {
      console.log("Error de conexión: " + error.message);
      setError(["Se produjo un error al grabar los datos."]);
    }
  };

  return {
    fields: { nombre, setNombre, nroMatricula, setNroMatricula, 
      domicilio, setDomicilio, localidad, setLocalidad, nroCasillero, setNroCasillero },
    error,
    handleSubmit,
  };
}
