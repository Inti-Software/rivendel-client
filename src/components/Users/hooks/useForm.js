import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { Users } from "../../../api/endpoints/users";
import { getGoogleCalendarConnected, setGoogleCalendarConnected, subscribeCalendar } from "../../../auth/authState";

const initialState = {
  nombre: '',
  nroHabilitacion: 0,
  password: '',
  newPassword: '',
  newPasswordRepeated: '',
  googleCalendarConnected: false,
  initializing: true,
  loading: false,
  errors: [],
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: [],
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };

    case 'SUBMIT_START':
      return {
        ...state,
        errors: [],
        loading: true,
      };

    case 'SUBMIT_SUCCESS':
      return initialState;

    case 'SUBMIT_FAIL': {
      const errors =
        typeof action.errors === 'string'
          ? [action.errors || 'Error en la solicitud']
          : action.errors || ['Error en la solicitud'];
      return {
        ...state,
        errors: errors,
        loading: false,
      };
    }

    case 'INITIAL_LOAD': {
      setGoogleCalendarConnected(action.payload.googleCalendarConnected);
      return {
        ...state,
        ...action.payload,
        initializing: false,
      };
    }
    default:
      return state;
  }
}

export default function useForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { id } = useParams();
  const [connected, setConnected] = useState(getGoogleCalendarConnected());

  useEffect(() => {
    const fetchData = async () => {
      const response = await Users.get(id);
      if (response.ok) {
        const data = response.data;
        dispatch({
          type: 'INITIAL_LOAD',
          payload: {
            nombre: data.nombre,
            nroHabilitacion: data.nroHabilitacion,
            googleCalendarConnected: data.googleCalendarConnected,
          },
        });
      } else {
        dispatch({ type: 'INITIAL_LOAD', payload: { errors: [response.error] } });
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const unsub = subscribeCalendar(setConnected);
    return unsub;
  }, []);

  const setField = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.id, value: e.target.value });
  };

  return { state, connected, dispatch, setField };
}
