import HttpRepository from "./../httpRepository";
import { RECORDS_PER_PAGE } from "./../constants";

export const Reclamos = new HttpRepository({
	get: (id) => ({ method: "get", url: `/reclamos/${id}` }),
	findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
		method: "get",
		url: `/reclamos?page=${currentPage}&limit=${recordsPerPage}`,
	}),
	create: ({ numero, rubros, idResolucion, fechaHoraInicio, pospuesto,
		horaFin, proxFecha, reclamantes, reclamados }) => ({
			method: "POST",
			url: `/reclamos`,
			headers: { "Content-Type": "application/json" },
			data: { numero, rubros, idResolucion, fechaHoraInicio, pospuesto,
				horaFin, proxFecha, reclamantes, reclamados },
		}),
	update: ({ id, numero, rubros, idResolucion, fechaHoraInicio, horaFin, 
		reclamantes, reclamados }) => ({
			method: "PATCH",
			url: `/reclamos/${id}`,
			headers: { "Content-Type": "application/json" },
			data: { numero, rubros, idResolucion, fechaHoraInicio, horaFin, 
				reclamantes, reclamados },
		}),
	delete: (id) => ({ method: "delete", url: `/reclamos/${id}` }),
});
