import HttpRepository from "./../httpRepository";
import { RECORDS_PER_PAGE } from "./../constants";

export const Reclamos = new HttpRepository({
	get: (id) => ({ method: "get", url: `/reclamos/${id}` }),
	findAll: ({ query, currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
		method: "get",
		url: `/reclamos?query=${query}&page=${currentPage}&limit=${recordsPerPage}`,
	}),
	create: ({ numero, rubros, idResolucion, fechaHoraInicio, pospuesto,
		horaFin, proximaAudiencia, reclamantes, reclamados }) => ({
			method: "POST",
			url: `/reclamos`,
			headers: { "Content-Type": "application/json" },
			data: { numero, rubros, idResolucion, fechaHoraInicio, pospuesto,
				horaFin, proximaAudiencia, reclamantes, reclamados },
		}),
	update: ({ id, numero, rubros, idResolucion, fechaHoraInicio, horaFin, 
		proximaAudiencia, reclamantes, reclamados }) => ({
			method: "PATCH",
			url: `/reclamos/${id}`,
			headers: { "Content-Type": "application/json" },
			data: { numero, rubros, idResolucion, fechaHoraInicio, horaFin, 
				proximaAudiencia, reclamantes, reclamados },
		}),
	delete: (id) => ({ method: "delete", url: `/reclamos/${id}` }),
});
