export const PENDIENTE = 1;
export const SIN_ARREGLO = 2;
export const CON_ARREGLO = 3;
export const POSTERGADO = 4;
export const FRACASO = 5;
export const ANULADO = 6;

export const RESOLUCIONES = [
	{ value: PENDIENTE, text: "Pendiente" },
	{ value: SIN_ARREGLO, text: "Sin acuerdo" },
	{ value: CON_ARREGLO, text: "Con acuerdo" },
	{ value: POSTERGADO, text: "Postergado" },
	{ value: FRACASO, text: "Fracaso" },
	{ value: ANULADO, text: "Anulado" },
]

export const isValidResolucion = (id) => {
	return RESOLUCIONES.some(r => r.value === id);
}

export const getResolucionText = (id) => {
	const resolucion = RESOLUCIONES.find(r => r.value === id);
	return resolucion ? resolucion.text : "Desconocida";
}