import { useReducer, useEffect } from 'react';
import { numeroALetras } from '../../Reclamos/numeros-a-letras.js';

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

    case 'INITIAL_LOAD': {
      return {
        ...state,
        ...action.payload,
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

export default function useFormDialog(visible, onCancel, defaultValues) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && visible) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onCancel]);

  useEffect(() => {
    dispatch({ type: 'INITIAL_LOAD', payload: {
      reclamante: defaultValues.reclamante ?? { dni: 0, nombre: '' },
      reclamado: defaultValues.reclamado ?? '',
      rubros: defaultValues.rubros ?? ''
    }});
  }, [defaultValues]);

  useEffect(() => {
    dispatch({ type: 'SET_FIELD', field: 'importeLetras', value: "PESOS " + numeroALetras(state.importe) });
  }, [state.importe]);

  return { state, dispatch };
}
