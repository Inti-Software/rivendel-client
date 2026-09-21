import { useReducer, useEffect } from "react";
import { reducer, initialState } from "../reducer";
import { Reclamos } from "../../../api/repositories/reclamos";
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
	const showSearchParteDialog = (isReclamante) => dispatch({ type: "SEARCH_PARTES", show: true, esReclamante: isReclamante });
	const hideSearchParteDialog = () => dispatch({ type: "SEARCH_PARTES", show: false});

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

	useEffect(() => {
		const getParte = (p, concatenado) => {
			const doc = (p.cuil && p.cuil !== '0')? p.cuil : p.nroDocumento !== '0'? p.nroDocumento : '';
			if (doc !== '') {
				return concatenado? `${doc} - ${p.nombre}` : { dni: doc, nombre: p.nombre };
			} else {
				return concatenado? p.nombre : { dni: 0, nombre: p.nombre };
			}
		}

		let reclamante = state.reclamantes.map((r) => getParte(r, false))?.[0];
		let reclamado = state.reclamados.map((r) => getParte(r, true))?.[0];
		const rubros = state.rubros;
		setField('reclamo', { reclamado, rubros, reclamante });
	}, [state.reclamantes, state.reclamados, state.rubros]);

	return { state, setField, setErrors, submitStart, submitSuccess, submitFail, showSearchParteDialog, hideSearchParteDialog };
}

