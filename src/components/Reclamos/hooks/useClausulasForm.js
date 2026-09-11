import { useReducer, useEffect } from 'react';

const initialState = {
  puesto: '',
  fecha: '',
  fechaTelegrama: '',
  reclamado: '',
  importe: 0,
  importeLetras: '',
  rubros: '',
  cuotas: {
    cantidad: 0,
    importe: 0,
    fechaPrimera: '',
  },
  reclamante: {
    dni: 0,
    nombre: '',
  },
  cuenta: {
    loading: false,
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

function getNewValue(currentValue, newValue) {
  return typeof currentValue === 'number' && !isNaN(Number(newValue)) ? Number(newValue) : newValue;
}

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      if (action.field.includes('.')) {
        const [parent, child] = action.field.split('.');

        return {
          ...state,
          [parent]: {
            ...state[parent],
            [child]: getNewValue(state[parent]?.[child], action.value),
          },
          errors: [],
        };
      }
      return {
        ...state,
        [action.field]: getNewValue(state[action.field], action.value),
        errors: [],
      };
    }

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

    case 'UPDATE_CUENTA':
      return {
        ...state,
        cuenta: action.payload,
      };

    case 'LOAD_CUENTA_START':
      return {
        ...state,
        cuenta: {
          ...state.cuenta,
          loading: true,
        },
      };

    case 'LOAD_CUENTA_END':
      return {
        ...state,
        cuenta: {
          ...state.cuenta,
          loading: false,
        },
      };

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
