import { setAuthData, getToken } from '../../../api/tokenStore.js';
import { useReducer, useEffect } from "react";

const initialState = {
	email: '',
	password: '',
	showPassword: false,
  initializing: true,
  error: '',
	redirect: false,
	loading: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: [],
      };

    case 'SUBMIT_START':
      return {
        ...state,
        error: '',
        loading: true,
      };

    case 'SUBMIT_SUCCESS': {
      setAuthData(action.authData);
      return {
				...initialState,
				redirect: true
			};
		}

    case 'SUBMIT_FAIL': {
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    }

    case 'INITIAL_LOAD': {			
      return {
        ...state,
        ...action.payload,
				redirect: getToken()? true : false,
        initializing: false,
      };
    }

		case 'TOGGLE_SHOW_PASSWORD': {
			return {
				...state,
				showPassword: !state.showPassword,
			}
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

  const setField = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.id, value: e.target.value });
  };

	return { state, dispatch, setField };
}
