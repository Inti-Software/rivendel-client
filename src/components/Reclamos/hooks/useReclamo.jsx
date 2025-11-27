import { useNotification } from "../../../contexts/Constants";
import { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { ACTION_CREATE } from "../../../utils/constants";
import { useParams } from "react-router-dom";

// Estado inicial
const initialState = {
  id: 0,
  numero: 0,
  rubros: "",
  idResolucion: 0,
  fechaHoraInicio: "",
  horaFin: "",
  reclamantes: [],
  reclamados: [],
  loading: false,
  errors: {}
};

// Reducer
function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: "" } // limpiar error al escribir
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors
      };

    case "SUBMIT_START":
      return { ...state, loading: true };

    case "SUBMIT_SUCCESS": {
      return initialState;
    }
    case "SUBMIT_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
}

export function useReclamo(request, accion, getRequest) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const validate = () => {
    const errors = {};
    if (state.numero <= 0) errors.numero = "Ingrese un número de conciliación válido";
    if (state.idResolucion <= 0) errors.idResolucion = "Seleccione una resolución válida";
    //validar fechaHoraInicio y horaFin que sean fechas válidas
    if (!state.fechaHoraInicio) errors.fechaHoraInicio = "Fecha y hora de inicio requerida";
    if (state.fechaHoraInicio && isNaN(Date.parse(state.fechaHoraInicio)))
      errors.fechaHoraInicio = "Ingrese una fecha y hora de inicio válidas";
    if (!state.horaFin) errors.horaFin = "Hora de fin requerida";
    if (state.horaFin && isNaN(Date.parse(state.horaFin)))
      errors.horaFin = "Ingrese una hora de fin válida";
    return errors;
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    try {
      // Enviar a una API .NET (ejemplo)
      await fetch("https://localhost:5001/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password
        })
      });

      // dispatch({ type: "SUBMIT_SUCCESS" });
      // alert("Usuario registrado");

      showSuccess(
          "El reclamo Nº " + numero +
            ` se ${
              accion === ACTION_CREATE ? "creó" : "actualizó"
            } correctamente.`
        );
      dispatch({ type: "SUBMIT_SUCCESS" });
      navigate("/reclamos");
    } catch (error) {
      //alert("Error con el servidor", err);
      console.log("Error de conexión: " + error.message);
      //setError(["Error al intentar ejecutar la transacción."]);
      //dispatch({ type: "SET_ERRORS", errors });
      dispatch({ type: "SUBMIT_FAIL" });
    }
  };



  /*  Hook personalizado para manejar el estado y la lógica de un reclamo.
      Parámetros:
      - request: función para enviar la solicitud de creación o actualización.
      - accion: acción a realizar (crear o actualizar).
      - getRequest: función para obtener los datos del reclamo existente (si aplica).
  */
  
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
      console.log({id, numero: numero, reclamantes: idsReclamantes, reclamados: idsReclamados})
      const response = await request({id, numero: numero, reclamantes: idsReclamantes, reclamados: idsReclamados});
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
