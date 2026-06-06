import { useReducer, useEffect } from "react";
import { reducer, initialState } from "../reducer";
import { Reclamos } from "../../../api/endpoints/reclamos";
import { mapApiToForm } from "../mappers";
import { POSTERGADO } from "../tiposResoluciones.js";

export default function useReclamoForm (id) {
  const [state, dispatch] = useReducer(reducer, initialState);

	const initialLoad = (payload) => { dispatch({ type: "INITIAL_LOAD", payload }) };
	const setField = (field, value) => { dispatch({ type: "SET_FIELD", field, value }) };
	const setErrors = (errors) => dispatch({ type: "SET_ERRORS", errors });
	const submitStart = () => dispatch({ type: "SUBMIT_START" });
	const submitSuccess = () => dispatch({ type: "SUBMIT_SUCCESS" });
	const submitFail = (errors) => dispatch({ type: "SUBMIT_FAIL", errors });
	const searchPartes = (isReclamante) => dispatch({ type: "SEARCH_PARTES", show: true, esReclamante: isReclamante });
	const hidePartesDialog = () => dispatch({ type: "SEARCH_PARTES", show: false});

	useEffect(() => {
		if (isNaN(id)) {
			setField("id", 0);
			return;
		}

		const load = async () => {
			const result = await Reclamos.get(id);
			let payload = {};
			if (result.ok) {
				payload = mapApiToForm(result.data);
			} else {
				payload = { errors: [result.error] };
			}
			initialLoad(payload);
		};
		load();
	}, [id]);

	useEffect(() => {
		if (state.idResolucion !== POSTERGADO) {
			setField("proxAudiencia", "");
		}
	}, [state.idResolucion]);

	return { state, setField, setErrors, submitStart, submitSuccess, submitFail, searchPartes, hidePartesDialog };
}

