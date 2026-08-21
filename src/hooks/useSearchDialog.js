import { useEffect, useReducer } from 'react';
import useDebounce from './useDebounce';

const initialState = {
	term: "",
	data: [],
	selectedId: null,
	done: false,
	error: "",
	loading: false
};

function reducer(state, action) {
	switch (action.type) {
		case "SET_TERM":
			return { ...state, term: action.value, done: false, data: [], error: "", selectedId: null };

		case "SEARCH_START":
			return { ...state, error: "", loading: true };

		case "SEARCH_SUCCESS":
			return { ...state, data: action.data, loading: false, done: true, selectedId: null };

		case "SEARCH_FAIL":
			return { ...state, error: action.error, loading: false, done: true, data: [] };

		case "SELECT_ROW":
			return { ...state, selectedId: action.id };

		default:
			return state;
	}
}

const DEFAULT_MIN_LENGTH = 3;
const DEFAULT_DEBOUNCE_MS = 300;

export default function useSearchDialog(searchFn, options = {}) {
	const { minTermLength = DEFAULT_MIN_LENGTH, debounceMs = DEFAULT_DEBOUNCE_MS } = options;
	const [state, dispatch] = useReducer(reducer, initialState);
	const debouncedTerm = useDebounce(state.term, debounceMs);

	const ejecutarBusqueda = (rawTerm) => {
		const term = rawTerm.trim();
		if (term.length < minTermLength) return;

		dispatch({ type: "SEARCH_START" });
		searchFn(term)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.error}`);
				}
				dispatch({ type: "SEARCH_SUCCESS", data: response.data.data });
			})
			.catch(() => {
				dispatch({
					type: "SEARCH_FAIL",
					error: "Ocurrió un error al realizar la búsqueda. Por favor, inténtelo de nuevo."
				});
			});
	};

	// Búsqueda automática mientras se tipea (debounced)
	useEffect(() => {
		if (debouncedTerm.trim()) {
			ejecutarBusqueda(debouncedTerm);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedTerm]);

	const setTerm = (value) => dispatch({ type: "SET_TERM", value });
	const selectRow = (id) => dispatch({ type: "SELECT_ROW", id });
	const selected = state.data.find(row => row.id === state.selectedId) ?? null;

	return {
		term: state.term,
		data: state.data,
		selected,
		selectedId: state.selectedId,
		done: state.done,
		error: state.error,
		loading: state.loading,
		setTerm,
		selectRow,
		// búsqueda manual (botón / Enter) usa el término actual, no el debounced
		buscarAhora: () => ejecutarBusqueda(state.term)
	};
}