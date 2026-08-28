import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Patrocinantes } from "../../../api/endpoints/patrocinantes";

const initialState = {
  id: 0,
  nombre: '',
  nroMatricula: 0,
  domicilio: '',
  localidad: '',
  nroCasillero: 0,
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

    case 'INITIAL_LOAD':
      return {
        ...state,
        ...action.payload,
        initializing: false,
      };

    default:
      return state;
  }
}

export default function useForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
	const { id } = useParams();

	useEffect(() => {
		if (isNaN(id)) return;

		try {
			const fetchData = async () => {
				const response = await Patrocinantes.get(id);
				if (response.ok) {
					const data = response.data;
					dispatch({ type: "INITIAL_LOAD", payload: {
						id: data.id,
						nombre: data.nombre,
						nroMatricula: data.nroMatricula,
						domicilio: data.domicilio,
						localidad: data.localidad,
						nroCasillero: data.nroCasillero
					}});
				} else {					
					dispatch({ type: "INITIAL_LOAD", payload: {} });
				}
			};
			fetchData();
		} catch (err) {
			dispatch({ type: "INITIAL_LOAD", payload: {} });
		}
	}, [id]);

  return { state, dispatch };
}
