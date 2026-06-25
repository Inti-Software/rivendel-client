export const initialState = {
	id: 0,
	numero: 0,
	fechaHoraInicio: "",
	horaFin: "",
	idResolucion: 0,
	proxAudiencia: "",
	rubros: "",
	reclamantes: [],
	reclamados: [],
	content: {},
	searchPartes: {
		show: false,
		esReclamante: true
	},
	initializing: true,
	loading: false,
	errors: []
};

export function reducer(state, action) {
	switch (action.type) {
		case "SET_FIELD":
			return {
				...state,
				[action.field]: action.value,
				errors: []
			};

		case "SET_ERRORS":
			return {
				...state,
				errors: action.errors
			};

		case "SUBMIT_START":
			return { 
				...state, 
				errors: [],
				loading: true 
			};

		case "SUBMIT_SUCCESS":
			return initialState;

		case "SUBMIT_FAIL": {
			const errors = (typeof action.errors === "string") ?
							[action.errors || "Error en la solicitud"] :
							action.errors || ["Error en la solicitud"];
			return { 
				...state,
				errors: errors,
				loading: false 
			};
		}
		case "SEARCH_PARTES":
			return { 
				...state, 
				searchPartes: { 
					show: action.show, 
					esReclamante: action.esReclamante 
				} 
			};

		case "INITIAL_LOAD":
			return { 
				...state,
				...action.payload,
				initializing: false,
				isUpdate: action.payload.id !== undefined
			};

		default:
			return state;
	}
}
