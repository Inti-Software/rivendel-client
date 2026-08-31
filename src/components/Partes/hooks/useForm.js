import { useReducer, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Partes } from '../../../api/endpoints/partes';
import { TiposDocumento } from '../../../api/endpoints/tiposDocumentos';

const initialState = {
  id: 0,
  nombre: '',
  idTipoDocumento: 0,
  nroDocumento: '0',
  enableNroDocumento: true,
  cuil: '',
  enableCuil: true,
  patrocinante: {
    id: 0,
    nroMatricula: 0,
    nombre: '',
  },
  esApoderado: false,
  localidad: '',
  domicilio: '',
  initializing: true,
  loading: false,
  searchPatrocinante: false,
  errors: [],
  isUpdate: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      if (action.field === 'enableCuil' && !action.value) {
        return {
          ...state,
          enableCuil: false,
          cuil: '',
          errors: [],
        };
      }
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

    case 'SEARCH_PARTES':
      return {
        ...state,
        searchPatrocinante: action.show,
      };

    case 'INITIAL_LOAD':
      return {
        ...state,
        ...action.payload,
        initializing: false,
        isUpdate: action.payload.id !== undefined,
      };

    default:
      return state;
  }
}

export default function useForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { id } = useParams();
  const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
    const fetchTiposDocumento = async () => {
      const result = await TiposDocumento.findAll();
      if (!result.ok) {
        throw new Error(`Error al obtener tipos de documentos: ${result.error}`);
      }

      const td = result.data.data.map((d) => ({
        value: d.id,
        text: d.descripcion,
      }));
      setTiposDocumento(td);
      dispatch({ type: 'SET_FIELD', field: 'idTipoDocumento', value: 1 });
    };

    fetchTiposDocumento();
    document.getElementById('nombre').focus();
  }, []);

  useEffect(() => {
    if (isNaN(id)) return;

    try {
      const fetchData = async () => {
        const response = await Partes.get(id);
        if (response.error) {
          dispatch({ type: 'INITIAL_LOAD', payload: {} });
        }
        const data = response.data;
        dispatch({
          type: 'INITIAL_LOAD',
          payload: {
            id: data.id,
            nombre: data.nombre,
            idTipoDocumento: data.idTipoDocumento,
            nroDocumento: data.nroDocumento,
            enableNroDocumento: data.nroDocumento.trim() !== '' && data.nroDocumento != '0',
            enableCuil: data.cuil.trim() !== '' && data.cuil != '0',
            cuil: data.cuil,
            patrocinante: {
              id: data.patrocinante?.id || 0,
              nombre: data.patrocinante?.nombre || '',
              nroMatricula: data.patrocinante?.nroMatricula || 0,
            },
            esApoderado: data.esApoderado,
            localidad: data.localidad,
            domicilio: data.domicilio,
          },
        });
      };
      fetchData();
    } catch {
      dispatch({ type: 'INITIAL_LOAD', payload: {} });
    }
  }, [id]);

  function toogleEnableCuil() {
    dispatch({ type: 'SET_FIELD', field: 'enableCuil', value: !state.enableCuil });
  }

  function toogleEnableNroDocumento() {
    dispatch({ type: 'SET_FIELD', field: 'enableNroDocumento', value: !state.enableNroDocumento });
    if (!state.enableNroDocumento) {
      dispatch({ type: 'SET_FIELD', field: 'nroDocumento', value: '0' });
    }
  }

  const toogleSearchPatrocinante = () => {
    dispatch({ type: 'SET_FIELD', field: 'searchPatrocinante', value: !state.searchPatrocinante });
  };

  const setField = (e) => {
    if (e.target.type === 'checkbox') {
      dispatch({ type: 'SET_FIELD', field: e.target.id, value: e.target.checked });
    } else {
      let v = e.target.value;
      if (e.target.id === 'cuil') {
        v = e.target.value.replace(/\D/g, '');
      }
      dispatch({ type: 'SET_FIELD', field: e.target.id, value: v });
    }
  };

  return {
    state,
    tiposDocumento,
    dispatch,
		setField,
    toogleEnableCuil,
    toogleEnableNroDocumento,
    toogleSearchPatrocinante,
  };
}
