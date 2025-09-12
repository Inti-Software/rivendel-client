import { useNotification } from "../../../contexts/Constants";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACTION_CREATE } from "../../../utils/constants";
import { useParams } from "react-router-dom";

export function useParte(request, accion, getRequest) {
  const [nombre, setNombre] = useState("");
  const [idTipoDocumento, setIdTipoDocumento] = useState(0);
  const [nroDocumento, setNroDocumento] = useState("");
  const [cuil, setCuil] = useState(0);
  const [patrocinante, setPatrocinante] = useState({id: 0, nombre: "", nroMatricula: ""});
  const [nroWhatsapp, setNroWhatsapp] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [localidad, setLocalidad] = useState("");
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
          setIdTipoDocumento(data.nroMatricula);
          setNroDocumento(data.domicilio);
          setCuil(data.nroCasillero);
          //setIdPatrocinante(data.idPatrocinante);
          setNroWhatsapp(data.nroWhatsapp);
          setLocalidad(data.localidad);
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
      const response = await request({
        nombre,
        idTipoDocumento,
        nroDocumento,
        cuil,
        domicilio,
        localidad,
        idPatrocinante: patrocinante.id,
        nroWhatsapp,
      });
      if (response.ok) {
        showSuccess(
          `El patrocinante ${nombre} se ${
            accion === ACTION_CREATE ? "creó" : "actualizó"
          } correctamente.`
        );
        setNombre("");
        setIdTipoDocumento("");
        setNroDocumento("");
        setCuil("");
        setDomicilio("");
        setLocalidad("");
        setPatrocinante({id: 0, nombre: "", nroMatricula: ""});
        setNroWhatsapp("");
        setError(null);
        navigate("/partes");
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
    fields: {
      nombre,
      setNombre,
      idTipoDocumento,
      setIdTipoDocumento,
      nroDocumento,
      setNroDocumento,
      cuil,
      setCuil,
      patrocinante,
      setPatrocinante,
      nroWhatsapp,
      setNroWhatsapp,
      domicilio,
      setDomicilio,
      localidad,
      setLocalidad,
    },
    error,
    handleSubmit,
  };
}
