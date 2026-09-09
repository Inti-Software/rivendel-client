//crear un componente react con estilos bootstrap para ingresar los siguientes campos en un 
// formulario de reclamos, utilizando el componente DatePicker para los campos de fecha y fecha-telegrama. Los campos a incluir son:
//puesto
//fecha
//fecha-telegrama
//reclamado
//importe
//importe-nros
//rubros
//nro-cuotas
//importe-cuotas
//fecha-primera-cuota
//titular-cuenta
//dni-reclamante
//cuil-titular-cuenta
//entidad-cuenta
//alias-cuenta
//reclamante

import { useReducer, useEffect } from 'react';

const initialState = {
  puesto: '',
  fecha: '',
  fechaTelegrama: '',
  reclamado: '',
  importe: 0.0,
  importeNros: '',
  rubros: '',
  cuotas: {
    cantidad: 0,
    importe: 0.0,
    fechaPrimera: '',
  },
  reclamante: {
    dni: 0,
    nombre: '',
  },
  cuenta: {
    titular: '',
    cuilTitular: '',
    entidad: '',
    alias: '',
  },
  initializing: true,
  errors: [],
  redirect: false,
  loading: false,
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

    case 'SUBMIT_SUCCESS': {
      return initialState;
    }

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

  useEffect(() => {
    dispatch({ type: 'INITIAL_LOAD' });
  }, []);

  return { state, dispatch };
}
